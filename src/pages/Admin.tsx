import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BarChart3,
  CreditCard,
  Users,
  FileText,
  Search,
  Download,
  Eye,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Mail,
  Filter,
  RefreshCw,
} from "lucide-react";
import AdminLogin from "./AdminLogin";

// Mock data for transactions
const mockTransactions = [
  {
    id: "TXN001",
    orderId: "order_1A2B3C",
    paymentId: "pay_1X2Y3Z",
    donorName: "Rajesh Kumar",
    email: "rajesh@example.com",
    phone: "+91-9876543210",
    amount: 5000,
    currency: "INR",
    status: "verified",
    paymentMethod: "card",
    donationType: "one-time",
    createdAt: "2025-01-02",
    certificateIssued: true,
  },
  {
    id: "TXN002",
    orderId: "order_4D5E6F",
    paymentId: "pay_4A5B6C",
    donorName: "Priya Singh",
    email: "priya@example.com",
    phone: "+91-8765432109",
    amount: 2500,
    currency: "INR",
    status: "pending",
    paymentMethod: "upi",
    donationType: "monthly",
    createdAt: "2025-01-01",
    certificateIssued: false,
  },
  {
    id: "TXN003",
    orderId: "order_7G8H9I",
    paymentId: "pay_7D8E9F",
    donorName: "Arjun Patel",
    email: "arjun@example.com",
    phone: "+91-7654321098",
    amount: 10000,
    currency: "INR",
    status: "verified",
    paymentMethod: "card",
    donationType: "one-time",
    createdAt: "2024-12-31",
    certificateIssued: true,
  },
  {
    id: "TXN004",
    orderId: "order_9J0K1L",
    paymentId: "pay_9G0H1I",
    donorName: "Sneha Desai",
    email: "sneha@example.com",
    phone: "+91-6543210987",
    amount: 1000,
    currency: "INR",
    status: "failed",
    paymentMethod: "netbanking",
    donationType: "one-time",
    createdAt: "2024-12-30",
    certificateIssued: false,
  },
];

// Mock donor data
const mockDonors = [
  {
    id: "DONOR001",
    name: "Rajesh Kumar",
    email: "rajesh@example.com",
    phone: "+91-9876543210",
    totalDonations: 15000,
    donationCount: 3,
    lastDonation: "2025-01-02",
    status: "active",
  },
  {
    id: "DONOR002",
    name: "Priya Singh",
    email: "priya@example.com",
    phone: "+91-8765432109",
    totalDonations: 5000,
    donationCount: 2,
    lastDonation: "2025-01-01",
    status: "active",
  },
  {
    id: "DONOR003",
    name: "Arjun Patel",
    email: "arjun@example.com",
    phone: "+91-7654321098",
    totalDonations: 10000,
    donationCount: 1,
    lastDonation: "2024-12-31",
    status: "active",
  },
];

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [selectedDonor, setSelectedDonor] = useState<any>(null);
  const [authed, setAuthed] = useState<boolean>(() => sessionStorage.getItem("isAdminAuthed") === "true");

  const handleLogout = () => {
    sessionStorage.removeItem("isAdminAuthed");
    setAuthed(false);
  };

  if (!authed) {
    return <AdminLogin onAuthSuccess={() => setAuthed(true)} />;
  }

  // Filter transactions
  const filteredTransactions = mockTransactions.filter((txn) => {
    const matchesSearch =
      txn.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.orderId.includes(searchTerm);
    const matchesStatus = filterStatus === "all" || txn.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Filter donors
  const filteredDonors = mockDonors.filter((donor) =>
    donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate statistics
  const totalRevenue = mockTransactions
    .filter((t) => t.status === "verified")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalTransactions = mockTransactions.length;
  const verifiedTransactions = mockTransactions.filter((t) => t.status === "verified").length;
  const pendingCertificates = mockTransactions.filter((t) => t.status === "verified" && !t.certificateIssued).length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-600">Verified</Badge>;
      case "pending":
        return <Badge className="bg-yellow-600">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-600">Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-secondary/5">
      {/* Header */}
      <div className="bg-gradient-to-r from-trust-navy via-primary to-secondary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-lg text-white/90">Manage transactions, donors, and certificates</p>
            </div>
            <div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">₹{totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-2">From verified transactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">{totalTransactions}</div>
              <p className="text-xs text-muted-foreground mt-2">{verifiedTransactions} verified</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Donors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{mockDonors.length}</div>
              <p className="text-xs text-muted-foreground mt-2">Active donors</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Certificates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{pendingCertificates}</div>
              <p className="text-xs text-muted-foreground mt-2">To be issued</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Transactions</span>
            </TabsTrigger>
            <TabsTrigger value="donors" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Donors</span>
            </TabsTrigger>
            <TabsTrigger value="certificates" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Certificates</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
          </TabsList>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Management</CardTitle>
                <CardDescription>View and manage all payment transactions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, email, or order ID..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full md:w-48">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Transactions Table */}
                <ScrollArea className="w-full">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Donor Name</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id} className="hover:bg-muted/50 cursor-pointer">
                          <TableCell className="font-mono text-sm">{transaction.orderId}</TableCell>
                          <TableCell className="font-medium">{transaction.donorName}</TableCell>
                          <TableCell className="font-semibold text-primary">₹{transaction.amount}</TableCell>
                          <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                          <TableCell className="text-sm capitalize">{transaction.paymentMethod}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{transaction.createdAt}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedTransaction(transaction)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>

                {/* Transaction Details Modal */}
                {selectedTransaction && (
                  <div className="mt-6 p-6 border rounded-lg bg-muted/30">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold">Transaction Details</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedTransaction(null)}
                      >
                        ✕
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Order ID</p>
                        <p className="font-mono font-semibold">{selectedTransaction.orderId}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Payment ID</p>
                        <p className="font-mono font-semibold">{selectedTransaction.paymentId}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Donor Name</p>
                        <p className="font-semibold">{selectedTransaction.donorName}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Email</p>
                        <p className="font-semibold">{selectedTransaction.email}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Phone</p>
                        <p className="font-semibold">{selectedTransaction.phone}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Amount</p>
                        <p className="font-semibold text-primary">₹{selectedTransaction.amount}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        {getStatusBadge(selectedTransaction.status)}
                      </div>
                      <div>
                        <p className="text-muted-foreground">Certificate Issued</p>
                        <p className="font-semibold">
                          {selectedTransaction.certificateIssued ? (
                            <CheckCircle className="w-5 h-5 text-green-600 inline" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-yellow-600 inline" />
                          )}
                          {selectedTransaction.certificateIssued ? " Yes" : " No"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button className="gap-2" size="sm">
                        <Mail className="w-4 h-4" />
                        Send Receipt
                      </Button>
                      {selectedTransaction.status === "verified" && !selectedTransaction.certificateIssued && (
                        <Button variant="outline" size="sm" className="gap-2">
                          <FileText className="w-4 h-4" />
                          Generate Certificate
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Donors Tab */}
          <TabsContent value="donors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Donor Management</CardTitle>
                <CardDescription>View and manage all donors and their contribution history</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search donors by name or email..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Donors Table */}
                <ScrollArea className="w-full">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Total Donations</TableHead>
                        <TableHead>Count</TableHead>
                        <TableHead>Last Donation</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDonors.map((donor) => (
                        <TableRow key={donor.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{donor.name}</TableCell>
                          <TableCell className="text-sm">{donor.email}</TableCell>
                          <TableCell className="font-semibold text-secondary">₹{donor.totalDonations.toLocaleString()}</TableCell>
                          <TableCell className="text-center">{donor.donationCount}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{donor.lastDonation}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedDonor(donor)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>

                {/* Donor Details Modal */}
                {selectedDonor && (
                  <div className="mt-6 p-6 border rounded-lg bg-muted/30">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold">Donor Profile</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedDonor(null)}
                      >
                        ✕
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Name</p>
                        <p className="font-semibold">{selectedDonor.name}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Email</p>
                        <p className="font-semibold">{selectedDonor.email}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Phone</p>
                        <p className="font-semibold">{selectedDonor.phone}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <Badge className="bg-green-600 capitalize">{selectedDonor.status}</Badge>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Contributions</p>
                        <p className="text-2xl font-bold text-secondary">₹{selectedDonor.totalDonations.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Donation Count</p>
                        <p className="text-2xl font-bold text-primary">{selectedDonor.donationCount}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button className="gap-2" size="sm">
                        <Mail className="w-4 h-4" />
                        Send Email
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="w-4 h-4" />
                        Export Data
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Certificate Management</CardTitle>
                <CardDescription>Generate and manage tax-exemption certificates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Pending Certificates */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Pending Certificates ({pendingCertificates})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockTransactions
                      .filter((t) => t.status === "verified" && !t.certificateIssued)
                      .map((transaction) => (
                        <Card key={transaction.id} className="bg-orange-50/50 border-orange-200">
                          <CardContent className="pt-6">
                            <div className="space-y-2 mb-4">
                              <p className="text-sm text-muted-foreground">Donor</p>
                              <p className="font-semibold">{transaction.donorName}</p>
                              <p className="text-sm text-muted-foreground">{transaction.email}</p>
                            </div>
                            <div className="space-y-2 mb-4">
                              <p className="text-sm text-muted-foreground">Amount</p>
                              <p className="text-2xl font-bold text-secondary">₹{transaction.amount}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button className="flex-1" size="sm" variant="default">
                                <FileText className="w-4 h-4 mr-2" />
                                Generate & Email
                              </Button>
                              <Button className="flex-1" size="sm" variant="outline">
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>

                {/* Issued Certificates */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Issued Certificates</h3>
                  <div className="space-y-2">
                    {mockTransactions
                      .filter((t) => t.certificateIssued)
                      .map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-4 border rounded-lg bg-green-50/50 border-green-200"
                        >
                          <div>
                            <p className="font-semibold">{transaction.donorName}</p>
                            <p className="text-sm text-muted-foreground">₹{transaction.amount} • {transaction.createdAt}</p>
                          </div>
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Reports</CardTitle>
                <CardDescription>View and export financial reports and analytics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Report Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
                    <CardContent className="pt-6">
                      <div className="text-sm text-muted-foreground mb-2">Daily Revenue</div>
                      <p className="text-2xl font-bold text-primary">₹5,000</p>
                      <p className="text-xs text-muted-foreground mt-2">Today's transactions</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5">
                    <CardContent className="pt-6">
                      <div className="text-sm text-muted-foreground mb-2">Monthly Revenue</div>
                      <p className="text-2xl font-bold text-secondary">₹45,000</p>
                      <p className="text-xs text-muted-foreground mt-2">This month</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-accent/10 to-accent/5">
                    <CardContent className="pt-6">
                      <div className="text-sm text-muted-foreground mb-2">Total Revenue (YTD)</div>
                      <p className="text-2xl font-bold text-accent">₹128,000</p>
                      <p className="text-xs text-muted-foreground mt-2">Year to date</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Donation Methods Breakdown */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Payment Methods Breakdown</h3>
                  <div className="space-y-3">
                    {[
                      { method: "Credit/Debit Card", count: 18, amount: 62500, percentage: 48 },
                      { method: "UPI", count: 12, amount: 38000, percentage: 30 },
                      { method: "Net Banking", count: 8, amount: 25000, percentage: 19 },
                      { method: "Wallet", count: 2, amount: 2500, percentage: 2 },
                    ].map((item) => (
                      <div key={item.method} className="space-y-2">
                        <div className="flex justify-between">
                          <p className="font-medium">{item.method}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.count} transactions • ₹{item.amount.toLocaleString()}
                          </p>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Donation Types */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Donation Types</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground mb-2">One-Time Donations</p>
                        <p className="text-3xl font-bold text-primary">28</p>
                        <p className="text-sm text-secondary font-semibold mt-2">₹95,000 total</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground mb-2">Monthly Recurring</p>
                        <p className="text-3xl font-bold text-accent">12</p>
                        <p className="text-sm text-secondary font-semibold mt-2">₹33,000 total</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Export Options */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Export to CSV
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Export to PDF
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Refresh Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
