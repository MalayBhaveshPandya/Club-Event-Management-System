import React from "react";

const HowToUse = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-10 flex items-center justify-center bg-indigo-50">
    <div className="max-w-2xl w-full bg-white rounded-[20px] shadow-lg p-8 mx-auto">
      <h1 className="text-3xl font-extrabold text-center text-indigo-700 mb-6">
        How to Use EventHub
      </h1>
      <p className="text-gray-800 mb-4 text-center text-lg">
        EventHub is your college's go-to platform for discovering, organizing,
        and joining events!
      </p>
      <ul className="list-disc list-inside mb-4 text-gray-700 text-base">
        <li className="mb-2">
          <span className="text-indigo-800 font-bold">Students:</span>
          <span>
            {" "}
            Explore upcoming and past events on the homepage. Register for
            events with quick, secure forms. After login, manage all your
            registrations from your personal dashboard under{" "}
            <strong>My Events</strong>. You can also view your profile.
          </span>
        </li>
        <li className="mb-2">
          <span className="text-indigo-800 font-bold">Clubs:</span>
          <span>
            {" "}
            Create a club account and verify your email. Get admin approval.
            Once approved, post new events with custom registration forms,
            upload posters, and view lists of registered students. Manage your
            club info and events any time!
          </span>
        </li>
      </ul>
      <div className="mb-6 text-gray-700">
        <span className="font-bold text-indigo-800">Quick Start:</span>
        <ul className="list-decimal ml-4 mt-1">
          <li>
            Register as a student or club (use the registration links in the top
            menu).
          </li>
          <li>Verify your email with the OTP sent to you.</li>
          <li>Login and start browsing events and clubs!</li>
          <li>Clubs: Get approved by an admin before posting events.</li>
        </ul>
      </div>
      <div className="text-center text-gray-600 mt-4">
        Need help? Contact your campus EventHub team or check our FAQs.
      </div>
    </div>
  </div>
);

export default HowToUse;
