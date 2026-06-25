import * as authService from '../services/auth.service.js';

export const signup = async (req, res) => {
    try {
        const result = await authService.signup(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const result = await authService.login(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

export const me = async (req, res) => {
    try {
        const user = await authService.getMe(req.user.id);
        res.status(200).json({ user });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};
