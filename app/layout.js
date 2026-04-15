import "./globals.css";
import { UserProvider } from "./context/UserContext";
import { AuthProvider } from "./context/AuthContext";
import AmplifyInit from "./components/AmplifyInit";

export const metadata = {
  title: "4,000 Weeks — Time Management for Mortals",
  description:
    "An interactive exploration of Oliver Burkeman's Four Thousand Weeks. Embrace your finite existence and make the most of the time you have.",
  openGraph: {
    title: "4,000 Weeks — Time Management for Mortals",
    description:
      "The average human lifespan is absurdly, terrifyingly, insultingly short. Make it count.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AmplifyInit>
          <AuthProvider>
            <UserProvider>{children}</UserProvider>
          </AuthProvider>
        </AmplifyInit>
      </body>
    </html>
  );
}
