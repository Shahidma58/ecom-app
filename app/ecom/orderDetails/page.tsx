import { Suspense } from "react";
import OrderDetails from "../components/orderDetails";

export default function OrderDetailsPage() {
  return (
    <Suspense fallback={<div>Loading order details...</div>}>
      <OrderDetails />
    </Suspense>
  );
}

// "use client";

// import { useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "../../redux/store";

// import { CartItemData, getFullCart } from "../../redux/slice/orderSlice";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "../components/ui/card";
// import { Badge } from "../components/ui/badge";

// export default function OrderDetails() {
//   const router = useRouter();
//   const dispatch = useDispatch<AppDispatch>();
//   const { currentCart, currentCartItems, loading, error } = useSelector(
//     (state: RootState) => state.order
//   );

//   const searchParams = useSearchParams();
//   const orderNumber = searchParams.get("orderNumber");

//   useEffect(() => {
//     if (orderNumber) {
//       dispatch(getFullCart(orderNumber));
//     }
//   }, [dispatch, orderNumber]);

//   if (loading) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="max-w-2xl mx-auto">
//           <div className="animate-pulse space-y-4">
//             <div className="h-8 bg-gray-200 rounded w-1/4"></div>
//             <div className="h-32 bg-gray-200 rounded"></div>
//             <div className="h-32 bg-gray-200 rounded"></div>
//             <div className="h-32 bg-gray-200 rounded"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="max-w-2xl mx-auto">
//           <div className="text-center">
//             <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
//             <p className="text-gray-600">{error}</p>
//             <button
//               onClick={() => router.push("/track-order")}
//               className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
//               Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!currentCart) {
//     return null;
//   }

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "Pending":
//         return "bg-yellow-500";
//       case "Completed":
//         return "bg-green-500";
//       case "Cancelled":
//         return "bg-red-500";
//       default:
//         return "bg-gray-500";
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="max-w-2xl mx-auto">
//         <h1 className="text-3xl font-bold mb-8">Order Details</h1>

//         <div className="space-y-6">
//           <Card>
//             <CardHeader>
//               <div className="flex justify-between items-center">
//                 <CardTitle>Order Information</CardTitle>
//                 {currentCart.cart_stat && (
//                   <Badge className={getStatusColor(currentCart.cart_stat)}>
//                     {currentCart.cart_stat}
//                   </Badge>
//                 )}
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-sm text-gray-500">Order Number</p>
//                   <p className="font-medium">{currentCart.cart_id}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Order Date</p>
//                   <p className="font-medium">
//                     {currentCart.cart_dt.slice(0, 10)}
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>Customer Information</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-sm text-gray-500">Name</p>
//                   <p className="font-medium">
//                     {`${currentCart.cust_fname} ${currentCart.cust_lname}`}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Email</p>
//                   <p className="font-medium">{currentCart.cust_email}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Phone</p>
//                   <p className="font-medium">{currentCart.cust_mbl}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Company</p>
//                   <p className="font-medium">{currentCart.cust_comp}</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>Shipping Address</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p>{currentCart.cust_addr_1}</p>
//               <p>{`${currentCart.cust_city}, ${currentCart.cust_ctry}`}</p>
//               {/* <p>{currentOrder.shippingAddress.postalCode}</p> */}
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>Order Items</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {currentCartItems?.map((item: CartItemData) => (
//                   <div
//                     key={item.cart_id_serl}
//                     className="flex gap-4 p-4 border rounded-lg">
//                     <img
//                       src={item.prd_img_lnk}
//                       alt={item.prd_desc}
//                       className="w-20 h-20 object-cover rounded"
//                     />
//                     <div className="flex-1">
//                       <h3 className="font-medium">{item.prd_desc}</h3>
//                       <p className="text-sm text-gray-500">
//                         Quantity: {item.prd_qty}
//                       </p>
//                       <p className="text-sm text-gray-500">
//                         Price: ${item.prd_rsp.toFixed(2)}
//                       </p>
//                     </div>
//                     <div className="text-right">
//                       <p className="font-medium">${item.tot_amt.toFixed(2)}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>Order Summary</CardTitle>
//             </CardHeader>

//             <CardContent>
//               <div className="space-y-2">
//                 {/* <div className="flex justify-between">
//                     <span>Subtotal</span>
//                     {currentOrder.sub<span>${currentOrder.subtotal.toFixed(2)}</span>
//                   </div> */}
//                 <div className="flex justify-between">
//                   <span>Tax</span>
//                   <span>${currentCart.tot_tax.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Shipping Cost</span>
//                   <span>${currentCart.dlvy_chgs.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between font-bold border-t pt-2 mt-2">
//                   <span>Total</span>
//                   <span>${currentCart.tot_amt.toFixed(2)}</span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }
