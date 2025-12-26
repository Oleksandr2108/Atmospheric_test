import { useEffect, useState } from "react";
import "./App.css";
import type { User } from "./types/User";
import UserMap from "./components/UsersMap/UserMap";
import InterestFilter from "./components/UsersMap/InterestFilter/InterestFilter";

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    fetch("/users.json")
      .then((res) => {
        return res.json();
      })
      .then((data: User[]) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ padding: "20px" }}>Loading users...</div>;
  }

  return (
    <div>
      <div>
        <InterestFilter onFilterChange={setFilter} />
      </div>
      <UserMap
        users={users}
        filter={filter}
      />
    </div>
  );
}

export default App;
