import { FiGrid, FiDollarSign, FiBarChart2, FiSettings, FiLogOut } from "react-icons/fi";
import { ACCENT } from "../constants/theme";
import styles from "../styles/dashboardStyles";

const items = [
  { icon: <FiGrid />,       page: "dashboard" },
  { icon: <FiDollarSign />, page: "expenses"  },
  { icon: <FiBarChart2 />,  page: "income"    },
  { icon: <FiSettings />,   page: "settings"  },
];

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside style={styles.sidebar}>
      <div style={styles.sbLogo}>
        <FiDollarSign size={18} color={ACCENT} />
      </div>

      {items.map(item => (
        <div
          key={item.page}
          style={{ ...styles.sbItem, ...(activePage === item.page ? styles.sbItemActive : {}) }}
          onClick={() => onNavigate(item.page)}
        >
          {item.icon}
        </div>
      ))}

      <div style={{ flex: 1 }} />

      <div
        style={styles.sbItem}
        onClick={() => { localStorage.removeItem("token"); window.location.href = "/"; }}
      >
        <FiLogOut />
      </div>
    </aside>
  );
}
