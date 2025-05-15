import CommonBreadcrumb from "@/CommonComponents/CommonBreadcrumb";
import CommonCardHeader from "@/CommonComponents/CommonCardHeader";
import Datatable from "@/CommonComponents/DataTable";
import { Fragment, useState, useEffect } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";

interface Transaction {
  transactionId: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  productInfo: string;
  updatedAt: string;
  __v: number;
}

interface SalesTransactionProps {
  order_id?: string;
}

const SalesTransaction = ({ order_id }: SalesTransactionProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!order_id) {
      setError("Order ID is required");
      setLoading(false);
      return;
    }

    const fetchTransactions = async () => {
      try {
        const response = await fetch(`/api/transactions/get?order_id=${order_id}`);
        const data = await response.json();
        if (data.status === 200 && data.transactions) {
          const transformedTransactions = data.transactions.map((transaction: Transaction) => {
            const istDate = new Date(transaction.updatedAt).toLocaleString('en-IN', {
              timeZone: 'Asia/Kolkata',
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric',
            });
            return {
              'transaction Id': transaction.transactionId,
              amount: transaction.amount,
              // currency: transaction.currency,
              status: transaction.status,
              'payment Method': transaction.paymentMethod,
              'product Info': transaction.productInfo,
              // __v: transaction.__v,
              'Last Update': istDate,
              // gatewayResponse: transaction.gatewayResponse?.response !== undefined
              //   ? String(transaction.gatewayResponse.response)
              //   : "N/A",
            };
          });
          setTransactions(transformedTransactions);
        } else {
          setError("No Transactions found");
        }
      } catch (err) {
        setError("Error fetching transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [order_id]);

  if (loading) {
    return <div className="p-5">Loading...</div>;
  }

  if (error) {
    return <div className="p-5">{error}</div>;
  }

  return (
    <Fragment>
      <CommonBreadcrumb title="Transactions" parent="sales/orders" />
      <Container fluid>
        <Row>
          <Col sm="12">
            <Card>
              <CommonCardHeader title="Transaction Details" />
              <CardBody>
                <div id="batchDelete" className="transactions">
                  <Datatable
                    multiSelectOption={false}
                    myData={transactions}
                    pageSize={10}
                    pagination={true}
                    class="-striped -highlight"
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default SalesTransaction;