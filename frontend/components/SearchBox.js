// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Search, Plus, Minus, Zap, Moon } from "lucide-react";
// import { format, addDays } from "date-fns";
// import { DateRange } from "react-date-range";
// import "react-date-range/dist/styles.css";
// import "react-date-range/dist/theme/default.css";


// export default function SearchBox() {
//   const router = useRouter();
//   const [mode, setMode] = useState("daily");
//   const [city, setCity] = useState("Ayodhya");
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [dateRange, setDateRange] = useState([
//     { startDate: new Date(), endDate: addDays(new Date(), 1), key: "selection" },
//   ]);
//   const [checkInTime, setCheckInTime] = useState("04:00 PM");
//   const [hours, setHours] = useState(3);
//   const [adults, setAdults] = useState(1);
//   const [children, setChildren] = useState(0);

//   const timeOptions = [
//     "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
//     "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM",
//     "09:00 PM", "10:00 PM",
//   ];

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (mode === "hourly") {
//       router.push(
//         `/search?city=${encodeURIComponent(city)}&bookingType=hourly&checkInDate=${format(
//           dateRange[0].startDate,
//           "yyyy-MM-dd"
//         )}&checkInTime=${checkInTime}&hours=${hours}`
//       );
//     } else {
//       router.push(
//         `/search?city=${encodeURIComponent(city)}&bookingType=daily&checkInDate=${format(
//           dateRange[0].startDate,
//           "yyyy-MM-dd"
//         )}&checkOutDate=${format(
//           dateRange[0].endDate,
//           "yyyy-MM-dd"
//         )}&adults=${adults}&children=${children}`
//       );
//     }
//   };

//   return (
//     <div className="w-full flex justify-center mt-10">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white shadow-lg rounded-3xl w-full max-w-[95rem] px-10 py-5 relative flex flex-col gap-5 transition-all duration-300"
//         style={{ minHeight: "180px" }}
//       >
//         {/* 🔘 Toggle Buttons */}
//         <div className="flex justify-center gap-2">
//           <button
//             type="button"
//             onClick={() => setMode("daily")}
//             className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-sm transition-all ${mode === "daily"
//               ? "bg-gray-900 text-white shadow"
//               : "bg-gray-100 text-gray-800 hover:bg-gray-200"
//               }`}
//           >
//             <Moon className="w-4 h-4" />
//             Full-Day Stay
//           </button>

//           <button
//             type="button"
//             onClick={() => setMode("hourly")}
//             className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-sm transition-all ${mode === "hourly"
//               ? "bg-gray-900 text-white shadow"
//               : "bg-gray-100 text-gray-800 hover:bg-gray-200"
//               }`}
//           >
//             <Zap className="w-4 h-4" />
//             Hourly Stay
//           </button>
//         </div>

//         {/* 📅 Search Fields */}
//         <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-200 px-8 py-3 min-h-[92px] gap-4 md:gap-2">
//           {/* Where */}
//           <div className="flex flex-col basis-[20%] px-2 border-r border-gray-200">
//             <label className="text-xs text-gray-500 mb-1">Where ?</label>
//             <select
//               value={city}
//               onChange={(e) => setCity(e.target.value)}
//               className="text-lg font-semibold text-gray-800 bg-transparent focus:outline-none"
//             >
//               <option>Ayodhya</option>
//               <option>Lucknow</option>
//               <option>Varanasi</option>
//             </select>
//           </div>

//           {/* When */}
//           <div className="flex flex-col basis-[25%] px-2 border-r border-gray-200 relative">
//             <label className="text-xs text-gray-500 mb-1">When ?</label>
//             <button
//               type="button"
//               onClick={() => setShowCalendar(!showCalendar)}
//               className="text-base font-semibold text-gray-800 text-left focus:outline-none whitespace-nowrap overflow-hidden text-ellipsis"
//             >
//               {mode === "hourly"
//                 ? format(dateRange[0].startDate, "dd MMM yy")
//                 : `${format(dateRange[0].startDate, "dd MMM yy")} - ${format(
//                   dateRange[0].endDate,
//                   "dd MMM yy"
//                 )}`}
//             </button>
//             {showCalendar && (
//               <div className="absolute top-full left-0 mt-2 z-50 bg-white shadow-lg rounded-xl border p-2">
//                 <DateRange
//                   ranges={dateRange}
//                   onChange={(item) => setDateRange([item.selection])}
//                   moveRangeOnFirstSelection={false}
//                   minDate={new Date()}
//                 />
//                 <div className="flex justify-end">
//                   <button
//                     onClick={() => setShowCalendar(false)}
//                     type="button"
//                     className="px-4 py-1 bg-gray-700 hover:bg-gray-800 text-white text-sm rounded-lg"
//                   >
//                     Done
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Adults & Children (Full Day) OR Time + Duration (Hourly) */}
//           {mode === "hourly" ? (
//             <div className="flex flex-row basis-[36%] justify-between px-2 border-r border-gray-200 gap-8">
//               {/* Check-In Time */}
//               <div className="flex flex-col flex-1 relative">
//                 <label className="text-xs text-gray-500 mb-1">Check-In Time</label>
//                 <div className="relative">
//                   <select
//                     value={checkInTime}
//                     onChange={(e) => setCheckInTime(e.target.value)}
//                     className="w-full min-w-[150px] text-lg font-semibold text-gray-800 bg-transparent focus:outline-none pr-10 appearance-none"
//                   >
//                     {timeOptions.map((t) => (
//                       <option key={t}>{t}</option>
//                     ))}
//                   </select>
//                   {/* custom dropdown arrow */}
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="w-4 h-4 text-gray-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                     strokeWidth={2}
//                   >
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//                   </svg>
//                 </div>
//               </div>

//               {/* Duration */}
//               <div className="flex flex-col flex-1 relative">
//                 <label className="text-xs text-gray-500 mb-1">Duration (Hours)</label>
//                 <div className="relative">
//                   <select
//                     value={hours}
//                     onChange={(e) => setHours(Number(e.target.value))}
//                     className="w-full min-w-[120px] text-lg font-semibold text-gray-800 bg-transparent focus:outline-none pr-10 appearance-none"
//                   >
//                     {[...Array(8)].map((_, i) => {
//                       const val = i + 3;
//                       return (
//                         <option key={val} value={val}>
//                           {val} Hour{val > 1 ? "s" : ""}
//                         </option>
//                       );
//                     })}
//                   </select>
//                   {/* custom dropdown arrow */}
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="w-4 h-4 text-gray-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                     strokeWidth={2}
//                   >
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//                   </svg>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="flex flex-row justify-between items-center basis-[30%] px-2 border-r border-gray-200">
//               {/* Adults */}
//               <div className="flex flex-col items-center">
//                 <label className="text-xs text-gray-500 mb-1">Adults</label>
//                 <div className="flex items-center justify-between border rounded-md px-3 h-[23px] w-28 bg-white">
//                   <button
//                     type="button"
//                     onClick={() => setAdults(Math.max(1, adults - 1))}
//                     className="p-1 text-gray-600 hover:text-black"
//                   >
//                     <Minus className="h-4 w-4" />
//                   </button>
//                   <span className="text-base font-semibold text-gray-800 w-6 text-center">
//                     {adults}
//                   </span>
//                   <button
//                     type="button"
//                     onClick={() => setAdults(adults + 1)}
//                     className="p-1 text-gray-600 hover:text-black"
//                   >
//                     <Plus className="h-4 w-4" />
//                   </button>
//                 </div>
//               </div>

//               <div className="h-10 w-px bg-gray-300"></div>

//               {/* Children */}
//               <div className="flex flex-col items-center">
//                 <label className="text-xs text-gray-500 mb-1">Children</label>
//                 <div className="flex items-center justify-between border rounded-md px-3 h-[23px]  w-28 bg-white">
//                   <button
//                     type="button"
//                     onClick={() => setChildren(Math.max(0, children - 1))}
//                     className="p-1 text-gray-600 hover:text-black"
//                   >
//                     <Minus className="h-4 w-4" />
//                   </button>
//                   <span className="text-base font-semibold text-gray-800 w-6 text-center">
//                     {children}
//                   </span>
//                   <button
//                     type="button"
//                     onClick={() => setChildren(children + 1)}
//                     className="p-1 text-gray-600 hover:text-black"
//                   >
//                     <Plus className="h-4 w-4" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Search Button */}
//           <div className="flex justify-center px-2 basis-[14%]">
//             <button
//               type="submit"
//               className="bg-gray-700 hover:bg-gray-800 text-white font-semibold rounded-xl px-8 py-3 shadow-md w-full md:w-auto"
//             >
//               <div className="flex items-center justify-center gap-2">
//                 <Search className="w-4 h-4" />
//                 Search
//               </div>
//             </button>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }

///////////////////responsive design changes only/////////////////////
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Minus, Zap, Moon } from "lucide-react";
import { format, addDays } from "date-fns";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function SearchBox() {
  const router = useRouter();
  const [mode, setMode] = useState("full");
  const [city, setCity] = useState("Ayodhya");
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState([
    { startDate: new Date(), endDate: addDays(new Date(), 1), key: "selection" },
  ]);
  const [checkInTime, setCheckInTime] = useState("04:00 PM");
  const [hours, setHours] = useState(3);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const timeOptions = [
    "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
    "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM",
    "09:00 PM", "10:00 PM",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "hourly") {
      router.push(
        `/search?city=${encodeURIComponent(city)}&bookingType=hourly&checkInDate=${format(
          dateRange[0].startDate,
          "yyyy-MM-dd"
        )}&checkInTime=${encodeURIComponent(checkInTime)}&hours=${hours}`
      );
    } else {
      router.push(
        `/search?city=${encodeURIComponent(city)}&bookingType=full&checkInDate=${format(
          dateRange[0].startDate,
          "yyyy-MM-dd"
        )}&checkOutDate=${format(
          dateRange[0].endDate,
          "yyyy-MM-dd"
        )}&adults=${adults}&children=${children}`
      );
    }
  };

  return (
    <div className="w-full flex justify-center mt-10 px-3 md:px-5">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-3xl w-full max-w-[1340px] px-4 md:px-8 py-6 transition-all duration-300"
      >
        {/* Toggle Buttons */}
        <div className="flex justify-center mb-5 flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setMode("full")}
            className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold text-sm transition-all ${
              mode === "full"
                ? "bg-gray-900 text-white shadow"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            <Moon className="w-4 h-4" />
            Full-Day Stay
          </button>
          <button
            type="button"
            onClick={() => setMode("hourly")}
            className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold text-sm transition-all ${
              mode === "hourly"
                ? "bg-gray-900 text-white shadow"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            <Zap className="w-4 h-4" />
            Hourly Stay
          </button>
        </div>

        {/* Search Fields */}
        <div className="border border-gray-200 rounded-2xl shadow-sm bg-white flex flex-col md:flex-row items-stretch justify-between p-4 md:p-5 gap-4 relative min-h-[120px] md:min-h-[110px]">
          {/* Where */}
          <div className="flex flex-col flex-1 w-full md:border-r border-gray-200 md:pr-4">
            <label className="text-xs text-gray-500 mb-1">Where?</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="text-lg font-semibold text-gray-800 bg-transparent focus:outline-none text-center"
            >
              <option>Ayodhya</option>
              <option>Lucknow</option>
              <option>Varanasi</option>
            </select>
          </div>

          {/* When */}
          <div className="flex flex-col flex-1 w-full md:border-r border-gray-200 md:px-4 relative z-50">
            <label className="text-xs text-gray-500">When?</label>
            <button
              type="button"
              onClick={() => setShowCalendar(!showCalendar)}
              className="text-lg font-semibold text-gray-800 text-center truncate focus:outline-none hover:text-gray-900"
            >
              {mode === "hourly"
                ? format(dateRange[0].startDate, "dd MMM yy")
                : `${format(dateRange[0].startDate, "dd MMM yy")} - ${format(
                    dateRange[0].endDate,
                    "dd MMM yy"
                  )}`}
            </button>
          </div>

          {/* Adults / Children (Full Day) */}
          {mode === "full" && (
            <>
              <div className="flex flex-col flex-1 items-center justify-center w-full md:border-r border-gray-200 mt-[-13px]">
                <label className="text-xs text-gray-500">Adults</label>
                <div className="flex items-center justify-center border rounded-md px-3 h-[38px] bg-white">
                  <button
                    type="button"
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    className="p-1 text-gray-600 hover:text-black"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-base font-semibold text-gray-800 w-6 text-center">
                    {adults}
                  </span>
                  <button
                    type="button"
                    onClick={() => setAdults(adults + 1)}
                    className="p-1 text-gray-600 hover:text-black"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col flex-1 items-center justify-center w-full md:border-r border-gray-200 mt-[-13px]">
                <label className="text-xs text-gray-500">Children</label>
                <div className="flex items-center justify-center border rounded-md px-3 h-[38px]  bg-white">
                  <button
                    type="button"
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    className="p-1 text-gray-600 hover:text-black"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-base font-semibold text-gray-800 w-6 text-center">
                    {children}
                  </span>
                  <button
                    type="button"
                    onClick={() => setChildren(children + 1)}
                    className="p-1 text-gray-600 hover:text-black"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Hourly Mode */}
          {mode === "hourly" && (
            <>
              <div className="flex flex-col flex-1 w-full md:border-r border-gray-200 md:px-4">
                <label className="text-xs text-gray-500 mb-1">Check-In Time</label>
                <select
                  value={checkInTime}
                  onChange={(e) => setCheckInTime(e.target.value)}
                  className="text-lg font-semibold text-gray-800 bg-transparent focus:outline-none text-center"
                >
                  {timeOptions.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col flex-1 w-full md:border-r border-gray-200 md:px-4">
                <label className="text-xs text-gray-500 mb-1">Duration (Hours)</label>
                <select
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="text-lg font-semibold text-gray-800 bg-transparent focus:outline-none text-center"
                >
                  {[...Array(8)].map((_, i) => {
                    const val = i + 3;
                    return (
                      <option key={val} value={val}>
                        {val} Hour{val > 1 ? "s" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>
            </>
          )}

          {/* Search Button */}
          <div className="flex justify-center md:justify-end w-full md:w-auto pt-2 md:pt-0">
            <button
              type="submit"
              className="w-full md:w-auto bg-gray-700 hover:bg-gray-800 text-white font-semibold rounded-xl px-8 py-3 shadow-md whitespace-nowrap transition-transform hover:scale-[1.03] cursor-pointer"
            >
              <div className="flex items-center justify-center gap-2">
                <Search className="w-4 h-4" />
                Search
              </div>
            </button>
          </div>
        </div>
      </form>

      {/* 📅 Calendar Overlay (MOBILE) */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000] md:hidden">
          <div className="bg-white rounded-2xl shadow-xl p-3 w-[95%] max-h-[90vh] overflow-y-auto">
            <DateRange
              ranges={dateRange}
              onChange={(item) => setDateRange([item.selection])}
              moveRangeOnFirstSelection={false}
              minDate={new Date()}
              rangeColors={["#1f2937"]}
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={() => setShowCalendar(false)}
                type="button"
                className="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📅 Desktop Inline Calendar */}
      {showCalendar && (
        <div className="hidden md:block absolute mt-2 z-50 bg-white shadow-xl rounded-xl border p-3">
          <DateRange
            ranges={dateRange}
            onChange={(item) => setDateRange([item.selection])}
            moveRangeOnFirstSelection={false}
            minDate={new Date()}
            rangeColors={["#1f2937"]}
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={() => setShowCalendar(false)}
              type="button"
              className="px-4 py-1 bg-gray-700 hover:bg-gray-800 text-white text-sm rounded-lg"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
