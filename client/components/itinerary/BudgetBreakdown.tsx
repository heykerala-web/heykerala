"use client";

interface BudgetBreakdownProps {
  budgetBreakdown: {
    stay: number;
    food: number;
    travel: number;
    tickets: number;
    extras: number;
  };
  budgetEstimate: {
    min: number;
    max: number;
  };
}

export default function BudgetBreakdown({
  budgetBreakdown,
  budgetEstimate,
}: BudgetBreakdownProps) {
  const total = Object.values(budgetBreakdown).reduce((a, b) => a + b, 0);

  const items = [
    { label: "Accommodation", value: budgetBreakdown.stay, icon: "🏨", color: "bg-blue-500" },
    { label: "Food & Dining", value: budgetBreakdown.food, icon: "🍽️", color: "bg-orange-500" },
    { label: "Travel & Transport", value: budgetBreakdown.travel, icon: "🚗", color: "bg-purple-500" },
    { label: "Tickets & Entry", value: budgetBreakdown.tickets, icon: "🎫", color: "bg-pink-500" },
    { label: "Extras & Shopping", value: budgetBreakdown.extras, icon: "🛍️", color: "bg-yellow-500" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span>💰</span>
        Budget Breakdown
      </h2>

      <div className="space-y-4 mb-6">
        {items.map((item, index) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0;
          return (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="font-medium text-gray-700">{item.label}</span>
                </div>
                <span className="font-bold text-gray-800">₹{item.value.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${item.color} transition-all`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t-2 border-gray-200 pt-4 mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-semibold text-gray-700">Total Estimated Cost</span>
          <span className="text-2xl font-bold text-emerald-600">₹{total.toLocaleString()}</span>
        </div>
        <p className="text-sm text-gray-500 text-center mt-2">
          Budget Range: ₹{budgetEstimate.min.toLocaleString()} - ₹{budgetEstimate.max.toLocaleString()}
        </p>
      </div>
    </div>
  );
}








