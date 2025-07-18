import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fuhnvarsdgaweacinzxb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1aG52YXJzZGdhd2VhY2luenhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4NTYwMzksImV4cCI6MjA2NzQzMjAzOX0.bLJ0wmNghinV0OD1WX0_0nZQT_PhoHs5X1L2YOP7IIo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);