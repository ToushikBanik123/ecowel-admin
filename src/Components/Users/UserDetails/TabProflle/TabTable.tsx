import { User as UserType, ShippingAddress } from "@/Types/Layout";
import { Table } from "reactstrap";

const TabTable = ({ user, ishide }: { user: UserType; ishide: any }) => {
  if (!user) return null;

  // 1️⃣ Extract the raw string
  const raw = user?.date_of_birth ?? "";

  // 2️⃣ Parse & validate
  const ms = Date.parse(typeof raw === 'string' ? raw : (raw instanceof Date ? raw.toISOString() : ''));
  const hasValid = !isNaN(ms); // false for NaN :contentReference[oaicite:3]{index=3}

  // 3️⃣ Choose display
  const displayDob = hasValid
    ? new Date(ms).toLocaleDateString("en-GB") // e.g. "19/04/2002" :contentReference[oaicite:4]{index=4}
    : "-";
  console.log("user", user);

  return (
    <div className="tab-pane fade show active">
      <h5 className="f-w-600 f-16">Profile</h5>
      <div className="table-responsive profile-table">
        <Table className="table-responsive">
          {ishide ? (
            <tbody>
              <tr>
                <td>First Name:</td>
                <td>{user?.firstName || user?.first_name}</td>
              </tr>
              <tr>
                <td>Last Name:</td>
                <td>{user?.lastName || user?.last_name}</td>
              </tr>
              <tr>
                <td>Email:</td>
                <td>{user?.email}</td>
              </tr>
              <tr>
                <td>Mobile Number:</td>
                <td>{user?.phone || user?.phone_number || "-"}</td>
              </tr>{" "}
              <tr>
                <td>Alternative Mobile Number:</td>
                <td>{user?.altPhone || "-"}</td>
              </tr>
              <tr>
                <td>Address Line 1:</td>
                <td>{user?.addressLine1 || "-"}</td>
              </tr>
              <tr>
                <td>Address Line 2:</td>
                <td>{user?.addressLine2 || "-"}</td>
              </tr>
              <tr>
                <td>Landmark:</td>
                <td>{user?.landmark || "-"}</td>
              </tr>
              <tr>
                <td>Country:</td>
                <td>{user?.country || user?.country || "-"}</td>
              </tr>
              <tr>
                <td>Region/State:</td>
                <td>{user?.state || user?.region_state || "-"}</td>
              </tr>
              <tr>
                <td>City:</td>
                <td>{user?.city || "-"}</td>
              </tr>
              <tr>
                <td>Zip Code:</td>
                <td>{user?.postalCode || user?.zip_code || "-"}</td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td>First Name:</td>
                <td>{user?.firstName || user?.first_name}</td>
              </tr>
              <tr>
                <td>Last Name:</td>
                <td>{user?.lastName || user?.last_name}</td>
              </tr>
              <tr>
                <td>Email:</td>
                <td>{user?.email}</td>
              </tr>
              <tr>
                <td>Mobile Number:</td>
                <td>{user?.phone || user?.phone_number || "-"}</td>
              </tr>
              <tr>
                <td>Role:</td>
                <td>{user?.role || "-"}</td>
              </tr>
              <tr>
                <td>Gender:</td>
                <td>{user?.gender || "-"}</td>
              </tr>
              <tr>
                <td>DoB:</td>
                <td>{displayDob}</td>
              </tr>
              <tr>
                <td>Flat/Plot:</td>
                <td>{user?.flat_plot || "-"}</td>
              </tr>
              <tr>
                <td>Address:</td>
                <td>{user?.address_line1 || user?.address || "-"}</td>
              </tr>
              <tr>
                <td>Country:</td>
                <td>{user?.country || user?.country || "-"}</td>
              </tr>
              <tr>
                <td>Region/State:</td>
                <td>{user?.state || user?.region_state || "-"}</td>
              </tr>
              <tr>
                <td>City:</td>
                <td>{user?.city || "-"}</td>
              </tr>
              <tr>
                <td>Zip Code:</td>
                <td>{user?.postalCode || user?.zip_code || "-"}</td>
              </tr>
            </tbody>
          )}
        </Table>
      </div>
    </div>
  );
};

export default TabTable;
