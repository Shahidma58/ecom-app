"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setError } from "../../../redux/slice/orderSlice";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleTrackOrder = async () => {
    if (!orderNumber.trim()) {
      toast.error("Please enter an order number");
      return;
    }

    setLoading(true);
    try {
      router.push(`/orderDetails?orderNumber=${orderNumber}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to track order";
      toast.error(errorMessage);
      dispatch(setError(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Track Your Order</h1>

        <div className="flex gap-4 mb-8">
          <Input
            type="text"
            placeholder="Enter your order number"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleTrackOrder} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Tracking...
              </>
            ) : (
              "Track Order"
            )}
          </Button>
        </div>

        {/* Rest of the component code remains unchanged */}
      </div>
    </div>
  );
}
