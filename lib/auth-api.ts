import axios from "axios";
import { LoginInput, LoginResponse } from "@/types/auth";

export async function loginRequest(
  payload: LoginInput
): Promise<LoginResponse> {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
    payload
  );
  return res.data;
}
