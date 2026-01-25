// hooks/useTransaction.ts
import { useState } from "react";
import { api } from "../lib/apiClient";

interface FormItem {
  sal_id: number;
  itm_cd: number | string;
  itm_desc: string;
  itm_rsp: number;
  itm_qty: number;
  itm_disc: number;
  itm_tax: number;
  itm_cost: number;
  itm_amt: number;
  itm_stat: string;
  itm_net_price: number;
}

interface TransactionTotals {
  sal_id: number;
  sal_dt: Date;
  sal_qty: number;
  sal_amt: number;
  sal_items: number;
  sal_disc: number;
  inp_by: string;
  sal_mbl?: number;
}

interface UseTransactionProps {
  initialUser: string;
//   fetchProductApi: (code: number) => Promise<any>;
}

export default function useTransaction({
  initialUser,
//   fetchProductApi,
}: UseTransactionProps) {
  const today = new Date();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<FormItem[]>([]);
  const [returnMode, setReturnMode] = useState(false);
  const [customerMobile, setCustomerMobile] = useState<string>("");

  const [totals, setTotals] = useState<TransactionTotals>({
    sal_id: 0,
    sal_dt: today,
    sal_amt: 0,
    sal_items: 0,
    sal_qty: 0,
    sal_disc: 0,
    inp_by: initialUser,
    sal_mbl: undefined,
  });

  const [form, setForm] = useState<FormItem>({
    sal_id: 0,
    itm_cd: "",
    itm_desc: "",
    itm_rsp: 0,
    itm_qty: 1,
    itm_disc: 0,
    itm_tax: 0,
    itm_cost: 0,
    itm_amt: 0,
    itm_stat: "A",
    itm_net_price: 0,
  });

  const fetchProduct = async (prd_cd: number | string) => {
    if (!prd_cd || prd_cd === "" || prd_cd === "0") return;

    console.log(prd_cd)

    try {
      setLoading(true);
      setError(null);

    //   const data = await fetchProductApi(prd_cd);
      const resp = await api.get(`/api/pos/get_prod?prd_cd=${prd_cd}`);

      const data = await resp.json();

      if (data.success) {
        const itemRsp = Number(data.data.max_rsp);
        const itemQty = Number(form.itm_qty);
        const discountAmt = Number(data.data.discount_amt) || 0;
        const netPrice = itemRsp - discountAmt;
        const itemAmt = netPrice * itemQty;

        setForm({
          ...form,
          itm_desc: data.data.prd_desc,
          itm_rsp: itemRsp,
          itm_disc: discountAmt,
          itm_net_price: netPrice,
          itm_cost: Number(data.data.pur_prc),
          itm_amt: itemAmt,
        });
      }
    } catch (error) {
      console.error("Error fetching Product:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch Product"
      );
      setForm((prev) => ({
        ...prev,
        itm_desc: "",
        itm_disc: 0,
        itm_net_price: 0,
      }));
    } finally {
      setLoading(false);
    }
  };

  const updateTotals = (updatedItems: FormItem[]) => {
    const totalQty = updatedItems.reduce(
      (sum, item) => sum + Number(item.itm_qty),
      0
    );
    const totalAmount = updatedItems.reduce(
      (sum, item) => sum + Number(item.itm_amt),
      0
    );
    const totalDisc = updatedItems.reduce(
      (sum, item) => sum + Number(item.itm_disc) * Number(item.itm_qty),
      0
    );
    const totalItems = updatedItems.length;

    setTotals({
      sal_id: 0,
      sal_dt: today,
      sal_qty: totalQty,
      sal_amt: totalAmount,
      sal_items: totalItems,
      sal_disc: totalDisc,
      inp_by: initialUser,
      sal_mbl: customerMobile ? Number(customerMobile) : undefined,
    });
  };

  const handleAddItem = () => {
    if (!form.itm_cd || !form.itm_desc) {
      setError("Err: Invalid product code");
      return;
    }

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.itm_cd === form.itm_cd
      );
      let updatedItems;

      if (existingIndex >= 0) {
        updatedItems = [...prevItems];
        const existing = updatedItems[existingIndex];
        const newQty = Number(existing.itm_qty) + Number(form.itm_qty);
        const newAmt = newQty * Number(existing.itm_net_price);
        updatedItems[existingIndex] = {
          ...existing,
          itm_qty: newQty,
          itm_amt: newAmt,
        };
      } else {
        updatedItems = [...prevItems, { ...form }];
      }

      updateTotals(updatedItems);

      setForm({
        sal_id: 0,
        itm_cd: "",
        itm_desc: "",
        itm_rsp: 0,
        itm_qty: 1,
        itm_disc: 0,
        itm_tax: 0,
        itm_cost: 0,
        itm_amt: 0,
        itm_stat: "A",
        itm_net_price: 0,
      });

      return updatedItems;
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Keep itm_cd as string to preserve leading zeros
    // Convert other numeric fields to numbers
    const numericFields = ["itm_qty", "itm_rsp", "itm_disc", "itm_amt"];
    const processedValue = numericFields.includes(name)
      ? Number(value) || 0
      : value;

    setForm((prev) => {
      const newForm = { ...prev, [name]: processedValue };

      if (name === "itm_qty") {
        const netPrice = Number(prev.itm_net_price || 0);
        newForm.itm_amt = netPrice * Number(processedValue || 0);
      } else if (name === "itm_rsp") {
        const netPrice =
          Number(processedValue || 0) - Number(prev.itm_disc || 0);
        newForm.itm_net_price = netPrice;
        newForm.itm_amt = netPrice * Number(prev.itm_qty || 0);
      }

      return newForm;
    });
  };

  const handleRemoveItem = (index: number) => {
    setItems((prevItems) => {
      const updatedItems = prevItems.filter((_, i) => i !== index);
      updateTotals(updatedItems);
      return updatedItems;
    });
  };

  const handleQuantityChange = (index: number, newQty: number) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index].itm_qty = newQty;
      updated[index].itm_amt = newQty * Number(updated[index].itm_net_price);
      updateTotals(updated);
      return updated;
    });
  };

  return {
    form,
    items,
    totals,
    loading,
    error,
    returnMode,
    customerMobile,
    setReturnMode,
    setCustomerMobile,
    setError,
    fetchProduct,
    handleAddItem,
    handleInputChange,
    handleRemoveItem,
    handleQuantityChange,
  };
}