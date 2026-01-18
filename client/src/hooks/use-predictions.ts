import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

// GET History
export function usePredictionHistory() {
  return useQuery({
    queryKey: [api.predict.history.path],
    queryFn: async () => {
      const res = await fetch(api.predict.history.path);
      if (!res.ok) throw new Error("Failed to fetch history");
      return api.predict.history.responses[200].parse(await res.json());
    },
  });
}

// POST Predict
export function useSubmitPrediction() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (features: number[]) => {
      // Validate locally first (optional, but good practice)
      const input = api.predict.submit.input.parse({ features });
      
      const res = await fetch(api.predict.submit.path, {
        method: api.predict.submit.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Prediction failed");
      }

      return api.predict.submit.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.predict.history.path] });
      toast({
        title: "Scan Complete",
        description: `Target Identified: ${data.result} (${(data.confidence || 0 * 100).toFixed(1)}%)`,
        variant: data.result === "M" ? "destructive" : "default", // M for Mine
      });
    },
    onError: (error) => {
      toast({
        title: "Scan Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
