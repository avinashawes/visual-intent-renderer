CREATE TABLE public.sell_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  produce_type text NOT NULL CHECK (produce_type IN ('crop','vegetable','grain')),
  produce_name text NOT NULL CHECK (char_length(produce_name) BETWEEN 2 AND 80),
  quantity numeric(12,2) NOT NULL CHECK (quantity > 0 AND quantity <= 100000),
  unit text NOT NULL DEFAULT 'quintal' CHECK (unit IN ('quintal','kg','tonne')),
  destination text NOT NULL CHECK (destination IN ('government','district_mandi')),
  district text NOT NULL CHECK (char_length(district) BETWEEN 2 AND 60),
  village text CHECK (village IS NULL OR char_length(village) <= 80),
  phone text NOT NULL CHECK (phone ~ '^[6-9][0-9]{9}$'),
  price_basis text NOT NULL CHECK (price_basis IN ('msp','farmer_minimum')),
  price_per_quintal numeric(12,2) NOT NULL CHECK (price_per_quintal > 0),
  msp_season text,
  msp_source text,
  available_from date NOT NULL DEFAULT current_date,
  notes text CHECK (notes IS NULL OR char_length(notes) <= 500),
  status text NOT NULL DEFAULT 'listed' CHECK (status IN ('listed','cancelled')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.sell_requests TO authenticated;
GRANT ALL ON public.sell_requests TO service_role;
ALTER TABLE public.sell_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own sell requests select" ON public.sell_requests FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own sell requests insert" ON public.sell_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND status = 'listed');
CREATE POLICY "own sell requests update" ON public.sell_requests FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX sell_requests_user_created_idx ON public.sell_requests(user_id, created_at DESC);