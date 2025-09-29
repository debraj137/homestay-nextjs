"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Minus } from "lucide-react";
import { DateRange } from "react-date-range";
import { format, addDays } from "date-fns"; // ✅ addDays for tomorrow
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function SearchBox() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1), // ✅ default tomorrow
      key: "selection",
    },
  ]);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const calendarRef = useRef(null);

  // ✅ Close calendar when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    }
    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCalendar]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!city || !dateRange[0].startDate || !dateRange[0].endDate) return;

    router.push(
      `/search?city=${encodeURIComponent(city)}&checkInDate=${format(
        dateRange[0].startDate,
        "yyyy-MM-dd"
      )}&checkOutDate=${format(
        dateRange[0].endDate,
        "yyyy-MM-dd"
      )}&adults=${adults}&children=${children}`
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 md:flex-row items-center max-w-3xl mx-auto bg-white rounded-lg shadow-md p-4"
    >
      {/* City Dropdown */}
      <div className="flex flex-col w-full md:w-1/4">
        <label className="text-xs font-semibold text-gray-600 mb-1">Destination</label>
        <select
          className="px-3 py-2 text-gray-800 border rounded focus:outline-none text-sm md:text-base"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        >
          <option value="" disabled>
            Select a city
          </option>
          <option value="Ayodhya">Ayodhya</option>
          <option value="Lucknow">Lucknow</option>
          <option value="Varanasi">Varanasi</option>
        </select>
      </div>

      {/* Date Range Picker */}
      <div className="flex flex-col w-full md:w-1/3 relative" ref={calendarRef}>
        <label className="text-xs font-semibold text-gray-600 mb-1">Dates</label>
        <button
          type="button"
          onClick={() => setShowCalendar(!showCalendar)}
          className="px-3 py-2 text-left text-gray-800 border rounded text-sm md:text-base w-full"
        >
          {`${format(dateRange[0].startDate, "dd/MM/yyyy")} → ${format(
            dateRange[0].endDate,
            "dd/MM/yyyy"
          )}`}
        </button>

        {showCalendar && (
          <div className="absolute top-full left-0 mt-2 z-[9999] bg-white shadow-lg rounded p-2">
            <DateRange
              editableDateInputs={true}
              onChange={(item) => {
                const start = item.selection.startDate;
                let end = item.selection.endDate;

                // ✅ prevent same-day selection → force endDate = next day
                if (
                  start &&
                  end &&
                  format(start, "yyyy-MM-dd") === format(end, "yyyy-MM-dd")
                ) {
                  end = addDays(start, 1);
                }

                setDateRange([{ ...item.selection, endDate: end }]);
              }}
              moveRangeOnFirstSelection={false}
              ranges={dateRange}
              minDate={new Date()}
              className="text-black w-[320px]"
            />

            {/* ✅ Done Button */}
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={() => setShowCalendar(false)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Adults & Children */}
      <div className="flex flex-row gap-2 w-full md:w-1/3 text-gray-800">
        {/* Adults */}
        <div className="flex flex-col w-1/2">
          <label className="text-xs font-semibold text-gray-600 mb-1">
            Adults
          </label>
          <div className="flex items-center justify-between border rounded px-2 h-[44px] border border-gray-800">
            <button
              type="button"
              onClick={() => setAdults(Math.max(1, adults - 1))}
              className="px-2 text-gray-600 hover:text-black"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium text-gray-800">{adults}</span>
            <button
              type="button"
              onClick={() => setAdults(adults + 1)}
              className="px-2 text-gray-600 hover:text-black"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Children */}
        <div className="flex flex-col w-1/2">
          <label className="text-xs font-semibold text-gray-600 mb-1">
            Children
          </label>
          <div className="flex items-center justify-between border rounded px-2 h-[44px] border border-gray-800">
            <button
              type="button"
              onClick={() => setChildren(Math.max(0, children - 1))}
              className="px-2 text-gray-600 hover:text-black"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium text-gray-800">{children}</span>
            <button
              type="button"
              onClick={() => setChildren(children + 1)}
              className="px-2 text-gray-600 hover:text-black"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search Button */}
      <div className="flex flex-col w-full md:w-auto">
        <label className="text-xs font-semibold text-gray-600 mb-1 invisible">
          Search
        </label>
        <button
          type="submit"
          className="cursor-pointer px-4 py-2 bg-red-500 text-white font-medium hover:bg-red-600 flex items-center space-x-2 w-full md:w-auto justify-center text-sm md:text-base rounded"
        >
          <Search className="h-4 w-4" />
          <span>Search</span>
        </button>
      </div>
    </form>
  );
}
