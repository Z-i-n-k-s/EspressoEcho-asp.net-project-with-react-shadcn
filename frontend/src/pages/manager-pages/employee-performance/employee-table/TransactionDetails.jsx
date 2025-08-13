import React from "react";
import { motion, AnimatePresence } from "framer-motion";
export default function TransactionDetails({ isOpen, empid, transactions , selectedDate}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <tr className="bg-[#f9f3ef]">
          <td colSpan="6" className="p-0">
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: "hidden" }}
            >
              <div className="p-4">
                {transactions[empid] ? (
                  <>
                    <h3 className="font-semibold mb-2 text-[#5c4033]">
                      Transactions on {selectedDate}
                    </h3>
                    <table className="w-full border border-[#e7dcd3] rounded-lg">
                      <thead>
                        <tr className="bg-[#e7dcd3] text-[#5c4033]">
                          <th className="p-2">Time</th>
                          <th className="p-2">Item</th>
                          <th className="p-2">Quantity</th>
                          <th className="p-2">Customer</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions[empid].map((t, i) => (
                          <tr key={i} className="text-[#5c4033] text-center">
                            <td className="p-2">{t.time}</td>
                            <td className="p-2">{t.item}</td>
                            <td className="p-2">{t.quantity}</td>
                            <td className="p-2">{t.customer}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                ) : (
                  <p>Loading details...</p>
                )}
              </div>
            </motion.div>
          </td>
        </tr>
      )}
    </AnimatePresence>
  );
}
