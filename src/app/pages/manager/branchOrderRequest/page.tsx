"use client";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/app/utils/axios";
import { getRequestInterface } from "@/app/types/request.type";
import { Eye, Package, X, Calendar, Building2, User, DollarSign } from "lucide-react";
import { CustomBadge } from "@/components/ui/customBadge";
import { successAlert, errorAlert } from "@/app/utils/alert";

export default function Page() {
  const [request, setRequest] = useState<getRequestInterface[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<getRequestInterface | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { data } = useQuery({
    queryKey: ["request"],
    queryFn: () => axiosInstance.get("/request/branch")
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      axiosInstance.patch(`/request/status`, { status , id }),
    onSuccess: () => {
        successAlert("Status Changed")
    },
    onError : () => {
        errorAlert("error")
    }
  });

  useEffect(() => {
    if (data?.data) setRequest(data?.data);
  }, [data]);

  const pendingOrders = request.filter(req => 
    req.status === "pending" || req.status === "to ship"
  );

  const completedOrders = request.filter(req => 
    req.status === "completed" || req.status === "rejected"
  );

  const handleStatusUpdate = (id: string, newStatus: string) => {
    updateStatusMutation.mutate({ id, status: newStatus });
    // Optimistically update the local state
    setRequest(prev => 
      prev.map(req => 
        req._id === id ? { ...req, status: newStatus } : req
      )
    );
  };

  const handleViewOrder = (order: getRequestInterface) => {
    setSelectedRequest(order);
    setShowModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "to ship":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="h-dvh w-full grid grid-cols-2 p-5 gap-6">
      {/* Pending/To Ship Orders Column */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Pending & To Ship Orders ({pendingOrders.length})
          </h2>
        </div>
        <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-120px)]">
          {pendingOrders.map((order) => (
            <div key={order._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-gray-900">{order.branch}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(order.date)}
                  </div>
                </div>
                <CustomBadge status={order.status} />
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {order.manager}
                </div>
                <div className="flex items-center">
                 total : 
                 <span className="text-green-500 font-bold ms-2">   ₱{order.total.toFixed(2)} </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleViewOrder(order)}
                  className="flex items-center px-3 py-1 text-sm bg-gray-100  hover:bg-gray-200 rounded-md transition-colors"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </button>
                
                {order.status === "pending" && (
                  <button
                    onClick={() => handleStatusUpdate(order._id, "to ship")}
                    className="flex items-center px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-md transition-colors"
                  >
                    <Package className="w-4 h-4 mr-1" />
                    To Ship
                  </button>
                )}


                {order.status === "pending" && (
                <button
                  onClick={() => handleStatusUpdate(order._id, "rejected")}
                  className="flex items-center px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-800 rounded-md transition-colors"
                >
                  <X className="w-4 h-4 mr-1" />
                  Reject
                </button>
                )}
                
                
              </div>
            </div>
          ))}
          
          {pendingOrders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No pending orders
            </div>
          )}
        </div>
      </div>

      {/* Completed/Rejected Orders Column */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Completed & Rejected Orders ({completedOrders.length})
          </h2>
        </div>
        <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-120px)]">
          {completedOrders.map((order) => (
            <div key={order._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-gray-900">{order.branch}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(order.date)}
                  </div>
                </div>
                <CustomBadge status={order.status} />
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {order.manager}
                </div>
                <div className="flex items-center">
                    total : 
                
                <span className="text-green-500 font-bold ms-2">   ₱{order.total.toFixed(2)} </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleViewOrder(order)}
                  className="flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </button>
              </div>
            </div>
          ))}
          
          {completedOrders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No completed orders
            </div>
          )}
        </div>
      </div>

      {/* Modal for viewing order details */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className=" bg-stone-50 shadow-lg  rounded-lg max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Order Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Branch:</span>
                    <p className="font-medium">{selectedRequest.branch}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Manager:</span>
                    <p className="font-medium">{selectedRequest.manager}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Date:</span>
                    <p className="font-medium">{formatDate(selectedRequest.date)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Total:</span> 
                    <span className="text-green-500 font-bold ms-2">   ₱{selectedRequest.total.toFixed(2)} </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500 me-2">Status:</span>
                   <CustomBadge status={selectedRequest.status} />
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Items:</h4>
                  <div className="space-y-2">
                    {selectedRequest.request.map((item) => (
                      <div key={item._id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-sm text-gray-600">Quantity: {item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}