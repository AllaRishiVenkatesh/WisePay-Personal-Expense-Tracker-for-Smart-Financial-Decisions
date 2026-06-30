export const categoryOptions = [
  {
    label: "🏠 Housing & Bills",
    options: [
      { value: "Rent", label: "Rent" },
      { value: "Home Loan / EMI", label: "Home Loan / EMI" },
      { value: "Maintenance", label: "Maintenance" },
      { value: "Electricity", label: "Electricity" },
      { value: "Water", label: "Water" },
      { value: "Gas", label: "Gas" },
      { value: "Internet / Wi-Fi", label: "Internet / Wi-Fi" },
      { value: "Mobile Recharge", label: "Mobile Recharge" },
      { value: "Property Tax", label: "Property Tax" }
    ]
  },
  {
    label: "🍔 Food & Dining",
    options: [
      { value: "Groceries", label: "Groceries" },
      { value: "Restaurants", label: "Restaurants" },
      { value: "Street Food", label: "Street Food" },
      { value: "Food Delivery", label: "Food Delivery" },
      { value: "Cafes / Coffee", label: "Cafes / Coffee" }
    ]
  },
  {
    label: "🚗 Transportation",
    options: [
      { value: "Fuel (Petrol/Diesel)", label: "Fuel (Petrol/Diesel)" },
      { value: "Public Transport", label: "Public Transport" },
      { value: "Cab / Taxi", label: "Cab / Taxi" },
      { value: "Vehicle Maintenance", label: "Vehicle Maintenance" },
      { value: "Parking", label: "Parking" },
      { value: "Tolls", label: "Tolls" }
    ]
  },
  {
    label: "🛍️ Shopping",
    options: [
      { value: "Clothing", label: "Clothing" },
      { value: "Electronics", label: "Electronics" },
      { value: "Accessories", label: "Accessories" },
      { value: "Home Items", label: "Home Items" },
      { value: "Online Shopping", label: "Online Shopping" }
    ]
  },
  {
    label: "🎬 Entertainment",
    options: [
      { value: "Movies", label: "Movies" },
      { value: "OTT Subscriptions", label: "OTT Subscriptions" },
      { value: "Games", label: "Games" },
      { value: "Events / Concerts", label: "Events / Concerts" }
    ]
  },
  {
    label: "🏥 Health & Fitness",
    options: [
      { value: "Doctor", label: "Doctor" },
      { value: "Medicines", label: "Medicines" },
      { value: "Health Insurance", label: "Health Insurance" },
      { value: "Gym", label: "Gym" },
      { value: "Fitness Programs", label: "Fitness Programs" }
    ]
  },
  {
    label: "🎓 Education",
    options: [
      { value: "Tuition Fees", label: "Tuition Fees" },
      { value: "Courses", label: "Courses" },
      { value: "Books", label: "Books" },
      { value: "Certifications", label: "Certifications" }
    ]
  },
  {
    label: "💳 Financial",
    options: [
      { value: "Loan EMI", label: "Loan EMI" },
      { value: "Credit Card Bill", label: "Credit Card Bill" },
      { value: "Bank Charges", label: "Bank Charges" },
      { value: "Taxes", label: "Taxes" },
      { value: "Investments", label: "Investments" }
    ]
  },
  {
    label: "✈️ Travel",
    options: [
      { value: "Flights", label: "Flights" },
      { value: "Hotels", label: "Hotels" },
      { value: "Local Travel", label: "Local Travel" },
      { value: "Trip Expenses", label: "Trip Expenses" }
    ]
  },
  {
    label: "🎁 Personal & Lifestyle",
    options: [
      { value: "Salon / Grooming", label: "Salon / Grooming" },
      { value: "Cosmetics", label: "Cosmetics" },
      { value: "Gifts", label: "Gifts" },
      { value: "Hobbies", label: "Hobbies" }
    ]
  },
  {
    label: "👨‍👩‍👧 Family & Others",
    options: [
      { value: "Family Support", label: "Family Support" },
      { value: "Kids Expenses", label: "Kids Expenses" },
      { value: "Pets", label: "Pets" },
      { value: "Donations / Charity", label: "Donations / Charity" },
      { value: "Miscellaneous", label: "Miscellaneous" }
    ]
  },
  {
    label: "💼 Salary & Work (Income)",
    options: [
      { value: "Salary", label: "Salary" },
      { value: "Bonus", label: "Bonus" },
      { value: "Freelance", label: "Freelance" },
      { value: "Part-time Income", label: "Part-time Income" },
      { value: "Business Income", label: "Business Income" }
    ]
  },
  {
    label: "📈 Investments & Returns (Income)",
    options: [
      { value: "Interest", label: "Interest" },
      { value: "Dividends", label: "Dividends" },
      { value: "Stock Profits", label: "Stock Profits" },
      { value: "Rental Income", label: "Rental Income" }
    ]
  },
  {
    label: "🎁 Other Income",
    options: [
      { value: "Gifts Received", label: "Gifts Received" },
      { value: "Refunds", label: "Refunds" },
      { value: "Cashback / Rewards", label: "Cashback / Rewards" },
      { value: "Lottery / Unexpected Income", label: "Lottery / Unexpected Income" }
    ]
  }
];

export const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: "rgba(255,255,255,0.055)",
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: "999px",
    padding: "0.2rem",
    color: "white",
    boxShadow: "none",
    "&:hover": {
      borderColor: "rgba(0,255,178,0.45)",
      boxShadow: "0 0 18px rgba(0,255,178,0.12)"
    }
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "white",
  }),
  input: (provided) => ({
    ...provided,
    color: "white",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "rgba(11,15,25,0.92)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "16px",
    backdropFilter: "blur(14px)",
    overflow: "hidden",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "rgba(0, 255, 178, 0.16)" : "transparent",
    color: "white",
    cursor: "pointer",
    "&:active": {
      backgroundColor: "rgba(124, 58, 237, 0.35)",
    }
  }),
  groupHeading: (provided) => ({
    ...provided,
    color: "#00ffb2",
    fontWeight: "bold",
    fontSize: "0.85rem",
    textTransform: "uppercase"
  })
};
