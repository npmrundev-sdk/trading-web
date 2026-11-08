import { MessageCircle } from "lucide-react";
import {
  Home,
  User,
  Settings,
  Folder,
  FileText,
  Gamepad2,
  Users,
  Banknote,
  ArrowRightLeft,
  Gift,
  TrendingUp,
  MessageSquare,
  ShieldCheck,
  Layers,
  Landmark,
  DollarSign,
  LayoutDashboard,
  Activity,
} from "lucide-react";

export const MENU_ITEMS = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/admin",
  },
  {
    title: "Games Management",
    icon: Gamepad2,
    href: "/admin/games",
    submenu: [
      {
        title: "All Games",
        icon: Folder,
        href: "/admin/games",
      },
      {
        title: "Categories",
        icon: FileText,
        href: "/admin/category",
      },
    ],
  },
  {
    title: "Trading Management",
    icon: TrendingUp,
    href: "/admin/trading",
    submenu: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/admin/trading",
      },
      {
        title: "Management",
        icon: Activity,
        href: "/admin/trading/management",
      },
    ],
  },
  {
    title: "User Management",
    icon: Users,
    href: "/admin/users",
    submenu: [
      {
        title: "All Users",
        icon: User,
        href: "/admin/users",
      },
      {
        title: "Referrals History",
        icon: Layers,
        href: "/admin/users/referrals-history",
      },
      {
        title: "Referral Tree (4 Gen)",
        icon: Layers,
        href: "/admin/users/referrals",
      },
    ],
  },
  {
    title: "Investment Hub",
    icon: DollarSign,
    href: "/admin/investments",
    submenu: [
      {
        title: "ROI Plans",
        icon: FileText,
        href: "/admin/investments/plans",
      },
      {
        title: "Active Investors",
        icon: Users,
        href: "/admin/investments/active",
      },
    ],
  },
  {
    title: "Bonus Engine",
    icon: Gift,
    href: "/admin/bonuses",
    submenu: [
      {
        title: "Bonus Settings",
        icon: Settings,
        href: "/admin/bonuses/settings",
      },
      {
        title: "Daily Events",
        icon: Gamepad2,
        href: "/admin/bonuses/events",
      },
    ],
  },
  {
    title: "Finance",
    icon: Banknote,
    href: "/admin/finance",
    submenu: [
      {
        title: "Transactions",
        icon: ArrowRightLeft,
        href: "/admin/transactions",
      },
      {
        title: "Bank Accounts",
        icon: Landmark,
        href: "/admin/bank-accounts",
      },
      // {
      //   title: "Payout Requests",
      //   icon: Folder,
      //   href: "/admin/payouts",
      // },
    ],
  },
  {
    title: "Marketing & SMS",
    icon: MessageSquare,
    href: "/admin/marketing",
    submenu: [
      {
        title: "Bulk SMS",
        icon: MessageSquare,
        href: "/admin/marketing/sms",
      },
      {
        title: "User Filters",
        icon: Settings,
        href: "/admin/marketing/filters",
      },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/admin/settings",
  },
  {
    title: "Live Chat Support",
    icon: MessageCircle,
    href: "/admin/live-chat",
  },
];
