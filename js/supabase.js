const SUPABASE_URL = 'https://sluhwepgxhbcxzopgumo.supabase.co';

// A chave pública do Supabase será colocada aqui
const SUPABASE_KEY = 'sb_publishable_IiaiuFctRtP2f8RocPlWww_JkPYCnkW';

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);
