import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Mail,
  Filter,
  RefreshCw,
  XCircle,
  X,
} from "lucide-react";
import AdminLogin from "./AdminLogin";
import { useApi } from "@/lib/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [selectedDonor, setSelectedDonor] = useState<any>(null);
  const [authed, setAuthed] = useState<boolean>(() => sessionStorage.getItem("isAdminAuthed") === "true");
  const [activeTab, setActiveTab] = useState("transactions");

  // Pagination states
  const [transactionPage, setTransactionPage] = useState(1);
  const [transactionTotalPages, setTransactionTotalPages] = useState(1);
  const [donorPage, setDonorPage] = useState(1);
  const [donorTotalPages, setDonorTotalPages] = useState(1);

  // API states
  const [stats, setStats] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [donors, setDonors] = useState<any[]>([]);
  const [pendingCerts, setPendingCerts] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [donationTypes, setDonationTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; type: string } | null>(null);

  // Loading flags to prevent duplicate calls
  const [statsLoaded, setStatsLoaded] = useState(false);
  const [transactionsLoaded, setTransactionsLoaded] = useState(false);
  const [donorsLoaded, setDonorsLoaded] = useState(false);
  const [certificatesLoaded, setCertificatesLoaded] = useState(false);
  const [reportsLoaded, setReportsLoaded] = useState(false);

  const { get, post } = useApi();

  // Fetch dashboard stats (called only once)
  const fetchStats = async () => {
    if (statsLoaded) return;
    try {
      const response = await get('/admin/stats');
      if (response.data.success) {
        setStats(response.data.stats);
        setStatsLoaded(true);
      }
    } catch (err: any) {
      setError(err);
      console.error('Stats fetch error:', err);
    }
  };

  // Fetch transactions (called when filters change)
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await get(`/admin/transactions?status=${filterStatus}&search=${searchTerm}&page=${transactionPage}&limit=10`);
      if (response.data.success) {
        setTransactions(response.data.transactions);
        setTransactionTotalPages(response.data.totalPages);
        setTransactionsLoaded(true);
      }
    } catch (err: any) {
      setError(err);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch donors (called when search/page changes)
  const fetchDonors = async () => {
    try {
      setLoading(true);
      const response = await get(`/admin/donors?search=${searchTerm}&page=${donorPage}&limit=10`);
      if (response.data.success) {
        setDonors(response.data.donors);
        setDonorTotalPages(response.data.totalPages);
        setDonorsLoaded(true);
      }
    } catch (err: any) {
      setError(err);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch pending certificates (called only when certificates tab is active)
  const fetchPendingCertificates = async () => {
    if (certificatesLoaded) return;
    try {
      const response = await get('/admin/certificates/pending');
      if (response.data.success) {
        setPendingCerts(response.data.certificates);
        setCertificatesLoaded(true);
      }
    } catch (err: any) {
      setError(err);
      console.error('Certificates fetch error:', err);
    }
  };

  // Fetch payment methods (called only when reports tab is active)
  const fetchPaymentMethods = async () => {
    if (reportsLoaded && paymentMethods.length > 0) return;
    try {
      const response = await get('/admin/reports/payment-methods');
      if (response.data.success) {
        setPaymentMethods(response.data.breakdown);
      }
    } catch (err: any) {
      setError(err);
      console.error('Payment methods fetch error:', err);
    }
  };

  // Fetch donation types (called only when reports tab is active)
  const fetchDonationTypes = async () => {
    if (reportsLoaded && donationTypes.length > 0) return;
    try {
      const response = await get('/admin/reports/donation-types');
      if (response.data.success) {
        setDonationTypes(response.data.breakdown);
        setReportsLoaded(true);
      }
    } catch (err: any) {
      setError(err);
      console.error('Donation types fetch error:', err);
    }
  };

  // Fetch donor details
  const fetchDonorDetails = async (donorId: string) => {
    try {
      const response = await get(`/admin/donors/${donorId}`);
      if (response.data.success) {
        setSelectedDonor(response.data.donor);
      }
    } catch (err: any) {
      setError(err);
      console.error('Donor details fetch error:', err);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("isAdminAuthed");
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_info");
    setAuthed(false);
  };


  const handleSendReceipt = async (donationId: string) => {
    if (!donationId) {
      setError({
        message: 'Invalid donation ID',
        type: 'receipt'
      });
      return;
    }

    try {
      setLoading(true);
      const response = await post(`/email/send-receipt/${donationId}`, {});

      if (response.data.success) {
        setError({
          message: response.data.message,
          type: 'success'
        });

        // Refresh transactions to update receipt status
        fetchTransactions();
      }
    } catch (err: any) {
      setError({
        message: err.response?.data?.message || 'Failed to send receipt',
        type: 'receipt'
      });
    } finally {
      setLoading(false);
    }
  };


  const handleSendCertificate = async (donationId: string) => {
    if (!donationId) {
      setError({
        message: 'Invalid donation ID',
        type: 'certificate'
      });
      return;
    }

    try {
      setLoading(true);
      const response = await post(`/email/send-certificate/${donationId}`, {});

      if (response.data.success) {
        setError({
          message: response.data.message,
          type: 'success'
        });

        // Refresh transactions and certificates
        fetchTransactions();
        setCertificatesLoaded(false);
        fetchPendingCertificates();

        // Update stats
        setStatsLoaded(false);
        fetchStats();
      }
    } catch (err: any) {
      setError({
        message: err.response?.data?.message || 'Failed to send certificate',
        type: 'certificate'
      });
    } finally {
      setLoading(false);
    }
  };



  // Refresh all data for current tab
  const handleRefreshAll = () => {
    fetchStats();
    fetchTransactions();
    fetchDonors();
    fetchPendingCertificates();
    fetchPaymentMethods();
    fetchDonationTypes();
  };

  // Load initial data - only stats
  useEffect(() => {
    if (authed) {
      fetchStats();
    }
  }, [authed]);

  // Load transactions only when transactions tab is active
  useEffect(() => {
    if (authed && activeTab === "transactions") {
      if (!transactionsLoaded) {
        fetchTransactions();
      }
    }
  }, [authed, activeTab]);

  // Refetch transactions when filter/search/page changes
  useEffect(() => {
    if (authed && activeTab === "transactions" && transactionsLoaded) {
      const timeoutId = setTimeout(() => {
        fetchTransactions();
      }, 500); // Debounce search
      return () => clearTimeout(timeoutId);
    }
  }, [filterStatus, searchTerm, transactionPage]);

  // Load donors only when donors tab is active
  useEffect(() => {
    if (authed && activeTab === "donors") {
      if (!donorsLoaded) {
        fetchDonors();
      }
    }
  }, [authed, activeTab]);

  // Refetch donors when search/page changes
  useEffect(() => {
    if (authed && activeTab === "donors" && donorsLoaded) {
      const timeoutId = setTimeout(() => {
        fetchDonors();
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm, donorPage]);

  // Load certificates only when certificates tab is active
  useEffect(() => {
    if (authed && activeTab === "certificates") {
      fetchPendingCertificates();
      // Also fetch transactions for issued certificates section
      if (!transactionsLoaded) {
        fetchTransactions();
      }
    }
  }, [authed, activeTab]);

  // Load reports only when reports tab is active
  useEffect(() => {
    if (authed && activeTab === "reports") {
      fetchPaymentMethods();
      fetchDonationTypes();
    }
  }, [authed, activeTab]);

  // Pagination handlers
  const handleTransactionPageChange = (newPage: number) => {
    setTransactionPage(newPage);
  };

  const handleDonorPageChange = (newPage: number) => {
    setDonorPage(newPage);
  };

  if (!authed) {
    return <AdminLogin onAuthSuccess={() => setAuthed(true)} />;
  }

  // Use API stats
  const totalRevenue = stats?.totalRevenue || 0;
  const totalTransactions = stats?.totalTransactions || 0;
  const verifiedTransactions = stats?.verifiedTransactions || 0;
  const pendingCertificates = stats?.pendingCertificates || 0;
  const dailyRevenue = stats?.dailyRevenue || 0;
  const monthlyRevenue = stats?.monthlyRevenue || 0;
  const totalDonors = stats?.totalDonors || 0;

  const filteredTransactions = transactions;
  const filteredDonors = donors;

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
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleRefreshAll} className="text-white">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto ">
        {/* Error Alert - Center Display with Better Visibility */}
        {error && (
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-lg px-4">
            <Alert
              variant={error.type === 'success' ? 'default' : 'destructive'}
              className={`shadow-2xl border-2 ${error.type === 'success'
                ? 'border-green-500 bg-white'
                : 'border-red-500 bg-white'
                }`}
            >
              {error.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <div className="flex items-start justify-between gap-3 w-full">
                <div className="flex-1">
                  <AlertTitle className={`font-bold text-base mb-1 ${error.type === 'success' ? 'text-green-900' : 'text-red-900'
                    }`}>
                    {error.type === 'success' ? 'Success' : 'Error'}
                  </AlertTitle>
                  <AlertDescription className={`text-sm font-medium ${error.type === 'success' ? 'text-green-700' : 'text-red-700'
                    }`}>
                    {error.message}
                  </AlertDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-7 w-7 p-0 rounded-full flex-shrink-0 ${error.type === 'success' ? 'hover:bg-green-100' : 'hover:bg-red-100'
                    }`}
                  onClick={() => setError(null)}
                >
                  <X className={`h-4 w-4 ${error.type === 'success' ? 'text-green-600' : 'text-red-600'
                    }`} />
                </Button>
              </div>
            </Alert>
          </div>
        )}
      </div>
      {/* Statistics Cards */}


      <div className="container mx-auto px-4 py-12">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {statsLoaded ? `₹${totalRevenue.toLocaleString()}` : "..."}
              </div>
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
              <div className="text-3xl font-bold text-accent">{totalDonors}</div>
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
                      {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((transaction) => (
                          <TableRow key={transaction.id} className="hover:bg-muted/50 cursor-pointer">
                            <TableCell className="font-mono text-sm">{transaction.orderId}</TableCell>
                            <TableCell className="font-medium">{transaction.donorName}</TableCell>
                            <TableCell className="font-semibold text-primary">₹{transaction.amount?.toLocaleString()}</TableCell>
                            <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                            <TableCell className="text-sm capitalize">{transaction.paymentMethod}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {new Date(transaction.createdAt).toLocaleDateString('en-IN')}
                            </TableCell>
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
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground">
                            {loading ? "Loading..." : "No transactions found"}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>

                {/* Pagination */}
                {transactionTotalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTransactionPageChange(transactionPage - 1)}
                      disabled={transactionPage === 1 || loading}
                    >
                      Previous
                    </Button>

                    {Array.from({ length: Math.min(transactionTotalPages, 5) }, (_, i) => {
                      let page;
                      if (transactionTotalPages <= 5) {
                        page = i + 1;
                      } else if (transactionPage <= 3) {
                        page = i + 1;
                      } else if (transactionPage >= transactionTotalPages - 2) {
                        page = transactionTotalPages - 4 + i;
                      } else {
                        page = transactionPage - 2 + i;
                      }
                      return (
                        <Button
                          key={page}
                          variant={page === transactionPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleTransactionPageChange(page)}
                          disabled={loading}
                        >
                          {page}
                        </Button>
                      );
                    })}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTransactionPageChange(transactionPage + 1)}
                      disabled={transactionPage === transactionTotalPages || loading}
                    >
                      Next
                    </Button>
                  </div>
                )}
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
                        <p className="font-mono font-semibold">{selectedTransaction.paymentId || 'N/A'}</p>
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
                        <p className="font-semibold text-primary">₹{selectedTransaction.amount?.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        {getStatusBadge(selectedTransaction.status)}
                      </div>
                      <div>
                        <p className="text-muted-foreground">Certificate Issued</p>
                        <p className="font-semibold">
                          {selectedTransaction.taxCertificateIssued ? (
                            <CheckCircle className="w-5 h-5 text-green-600 inline" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-yellow-600 inline" />
                          )}
                          {selectedTransaction.taxCertificateIssued ? " Yes" : " No"}
                        </p>
                      </div>
                      {selectedTransaction.taxCertificateNumber && (
                        <div className="col-span-2">
                          <p className="text-muted-foreground">Certificate Number</p>
                          <p className="font-mono font-semibold text-green-600">
                            {selectedTransaction.taxCertificateNumber}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Buttons Section */}
                    <div className="mt-4 flex gap-2">
                      <Button
                        className="gap-2"
                        size="sm"
                        onClick={() => handleSendReceipt(selectedTransaction.id)}
                        disabled={loading}
                      >
                        <Mail className="w-4 h-4" />
                        {selectedTransaction.receiptSent ? 'Resend Receipt' : 'Send Receipt'}
                      </Button>

                      {selectedTransaction.status === "verified" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleSendCertificate(selectedTransaction.id)}
                          disabled={loading}
                        >
                          <FileText className="w-4 h-4" />
                          {selectedTransaction.taxCertificateIssued
                            ? 'Resend Certificate'
                            : 'Generate & Send Certificate'}
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
                      {filteredDonors.length > 0 ? (
                        filteredDonors.map((donor) => (
                          <TableRow key={donor.id} className="hover:bg-muted/50">
                            <TableCell className="font-medium">{donor.name}</TableCell>
                            <TableCell className="text-sm">{donor.email}</TableCell>
                            <TableCell className="font-semibold text-secondary">₹{donor.totalDonations?.toLocaleString()}</TableCell>
                            <TableCell className="text-center">{donor.donationCount}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {new Date(donor.lastDonation).toLocaleDateString('en-IN')}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => fetchDonorDetails(donor.id)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground">
                            {loading ? "Loading..." : "No donors found"}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>

                {/* Pagination */}
                {donorTotalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                      Page {donorPage} of {donorTotalPages}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDonorPageChange(donorPage - 1)}
                        disabled={donorPage === 1 || loading}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDonorPageChange(donorPage + 1)}
                        disabled={donorPage === donorTotalPages || loading}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}

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
                        <Badge className="bg-green-600 capitalize">{selectedDonor.status || 'active'}</Badge>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Contributions</p>
                        <p className="text-2xl font-bold text-secondary">₹{selectedDonor.totalDonations?.toLocaleString()}</p>
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
                {/* Donations Eligible for Certificates */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    All Verified Donations ({pendingCerts.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pendingCerts.length > 0 ? (
                      pendingCerts.map((cert) => (
                        <Card
                          key={cert.id}
                          className={cert.taxCertificateIssued
                            ? "bg-green-50/50 border-green-200"
                            : "bg-orange-50/50 border-orange-200"}
                        >
                          <CardContent className="pt-6">
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">Donor</p>
                                {cert.taxCertificateIssued && (
                                  <Badge className="bg-green-600">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Issued
                                  </Badge>
                                )}
                              </div>
                              <p className="font-semibold">{cert.donorName}</p>
                              <p className="text-sm text-muted-foreground">{cert.email}</p>
                            </div>
                            <div className="space-y-2 mb-4">
                              <p className="text-sm text-muted-foreground">Amount</p>
                              <p className="text-2xl font-bold text-secondary">₹{cert.amount?.toLocaleString()}</p>
                              {cert.taxCertificateNumber && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Cert #: {cert.taxCertificateNumber}
                                </p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                className="flex-1"
                                size="sm"
                                variant="default"
                                onClick={() => handleSendCertificate(cert.id)}
                                disabled={loading}
                              >
                                <FileText className="w-4 h-4 mr-2" />
                                {cert.taxCertificateIssued ? 'Resend Certificate' : 'Generate & send Certificate'}
                              </Button>
                              <Button
                                className="flex-1"
                                size="sm"
                                variant="outline"
                                onClick={() => handleSendReceipt(cert.id)}
                                disabled={loading}
                              >
                                <Mail className="w-4 h-4 mr-2" />
                                {cert.receiptSent ? 'Resend Receipt' : 'Send Receipt'}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <p className="text-muted-foreground col-span-2">
                        {loading ? "Loading..." : "No verified donations found"}
                      </p>
                    )}
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
                      <p className="text-2xl font-bold text-primary">₹{dailyRevenue.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground mt-2">Today's transactions</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5">
                    <CardContent className="pt-6">
                      <div className="text-sm text-muted-foreground mb-2">Monthly Revenue</div>
                      <p className="text-2xl font-bold text-secondary">₹{monthlyRevenue.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground mt-2">This month</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-accent/10 to-accent/5">
                    <CardContent className="pt-6">
                      <div className="text-sm text-muted-foreground mb-2">Total Revenue (YTD)</div>
                      <p className="text-2xl font-bold text-accent">₹{totalRevenue.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground mt-2">Year to date</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Payment Methods Breakdown */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Payment Methods Breakdown</h3>
                  <div className="space-y-3">
                    {paymentMethods.length > 0 ? (
                      paymentMethods.map((item) => (
                        <div key={item.method} className="space-y-2">
                          <div className="flex justify-between">
                            <p className="font-medium capitalize">{item.method}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.count} transactions • ₹{item.amount?.toLocaleString()}
                            </p>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">Loading payment data...</p>
                    )}
                  </div>
                </div>

                {/* Donation Types */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Donation Types</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {donationTypes.length > 0 ? (
                      donationTypes.map((item) => (
                        <Card key={item.type}>
                          <CardContent className="pt-6">
                            <p className="text-sm text-muted-foreground mb-2 capitalize">{item.type} Donations</p>
                            <p className="text-3xl font-bold text-primary">{item.count}</p>
                            <p className="text-sm text-secondary font-semibold mt-2">₹{item.amount?.toLocaleString()} total</p>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <p className="text-muted-foreground col-span-2">Loading donation types...</p>
                    )}
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