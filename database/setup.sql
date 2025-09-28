-- Tabela para armazenar configurações do sistema
CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY,
    stripe_secret_key TEXT,
    stripe_public_key TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para armazenar produtos
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    category TEXT,
    stripe_product_id TEXT,
    stripe_price_id TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para administradores (opcional, se quiser usar JWT em vez de token simples)
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inserir configuração padrão
INSERT INTO settings (id) VALUES ('stripe_config') ON CONFLICT (id) DO NOTHING;

-- RLS (Row Level Security) - opcional
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (podem ser ajustadas conforme necessário)
CREATE POLICY "Allow service role full access on settings" ON settings
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access on products" ON products
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access on admins" ON admins
    FOR ALL USING (auth.role() = 'service_role');