import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Box, Button, Link as MuiLink, Stack, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import type { z } from "zod";

import { registerApiV1AuthRegisterPostBody } from "@/api/generated/zod";
import { useAuth } from "@/context/AuthContext";
import { useRegister } from "@/hooks/useAuth";

import { AuthShell } from "./LoginPage";

type RegisterForm = z.infer<typeof registerApiV1AuthRegisterPostBody>;

export function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const mutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerApiV1AuthRegisterPostBody) });

  const onSubmit = handleSubmit((values) => {
    mutation.mutate(values, {
      onSuccess: (data) => {
        login(data.token);
        navigate("/", { replace: true });
      },
    });
  });

  return (
    <AuthShell title="ثبت‌نام">
      <Box component="form" onSubmit={onSubmit} noValidate>
        <Stack spacing={2}>
          {mutation.isError && <Alert severity="error">{mutation.error.message}</Alert>}
          <TextField
            label="نام نمایشی"
            error={Boolean(errors.display_name)}
            helperText={errors.display_name?.message}
            {...register("display_name")}
          />
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
            autoComplete="new-password"
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
            {...register("password")}
          />
          <Button type="submit" variant="contained" size="large" disabled={mutation.isPending}>
            {mutation.isPending ? "در حال ثبت‌نام…" : "ثبت‌نام"}
          </Button>
          <Typography variant="body2" textAlign="center">
            حساب دارید؟{" "}
            <MuiLink component={RouterLink} to="/login">
              ورود
            </MuiLink>
          </Typography>
        </Stack>
      </Box>
    </AuthShell>
  );
}
