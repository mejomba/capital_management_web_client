import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Box, Button, Link as MuiLink, Paper, Stack, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import type { z } from "zod";

import { loginApiV1AuthLoginPostBody } from "@/api/generated/zod";
import { useAuth } from "@/context/AuthContext";
import { useLogin } from "@/hooks/useAuth";

type LoginForm = z.infer<typeof loginApiV1AuthLoginPostBody>;

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const mutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginApiV1AuthLoginPostBody) });

  const onSubmit = handleSubmit((values) => {
    mutation.mutate(values, {
      onSuccess: (data) => {
        login(data.token);
        navigate("/", { replace: true });
      },
    });
  });

  return (
    <AuthShell title="ورود">
      <Box component="form" onSubmit={onSubmit} noValidate>
        <Stack spacing={2}>
          {mutation.isError && <Alert severity="error">{mutation.error.message}</Alert>}
          <TextField
            label="ایمیل"
            type="email"
            autoComplete="email"
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            {...register("email")}
          />
          <TextField
            label="رمز عبور"
            type="password"
            autoComplete="current-password"
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
            {...register("password")}
          />
          <Button type="submit" variant="contained" size="large" disabled={mutation.isPending}>
            {mutation.isPending ? "در حال ورود…" : "ورود"}
          </Button>
          <Typography variant="body2" textAlign="center">
            حساب ندارید؟{" "}
            <MuiLink component={RouterLink} to="/register">
              ثبت‌نام
            </MuiLink>
          </Typography>
        </Stack>
      </Box>
    </AuthShell>
  );
}

export function AuthShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", p: 2 }}>
      <Paper sx={{ p: 4, width: "100%", maxWidth: 400 }} elevation={3}>
        <Typography variant="h5" fontWeight={700} mb={3} textAlign="center">
          {title}
        </Typography>
        {children}
      </Paper>
    </Box>
  );
}
