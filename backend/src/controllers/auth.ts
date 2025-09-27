import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Verificar se o email já existe
      const { data: existingAdmin } = await supabase
        .from('admins')
        .select()
        .eq('email', email)
        .single();

      if (existingAdmin) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }

      // Criar hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Inserir novo admin
      const { data: admin, error } = await supabase
        .from('admins')
        .insert([{ email, password: hashedPassword }])
        .select()
        .single();

      if (error) throw error;

      // Gerar token JWT
      const token = jwt.sign(
        { id: admin.id },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      return res.json({ token });
    } catch (error) {
      console.error('Erro no registro:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Buscar admin pelo email
      const { data: admin } = await supabase
        .from('admins')
        .select()
        .eq('email', email)
        .single();

      if (!admin) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Verificar senha
      const validPassword = await bcrypt.compare(password, admin.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Gerar token JWT
      const token = jwt.sign(
        { id: admin.id },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      return res.json({ token });
    } catch (error) {
      console.error('Erro no login:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async getProfile(req: Request, res: Response) {
    try {
      const adminId = (req as any).adminId;

      const { data: admin } = await supabase
        .from('admins')
        .select('id, email, created_at')
        .eq('id', adminId)
        .single();

      if (!admin) {
        return res.status(404).json({ error: 'Admin não encontrado' });
      }

      return res.json(admin);
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
};