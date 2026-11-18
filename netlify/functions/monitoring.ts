import monitoring from "../../api/monitoring.ts";

// Share the same envelope validation and forwarding rules with Vercel.
export default function handler(request: Request): Promise<Response> {
  return monitoring(request);
}
