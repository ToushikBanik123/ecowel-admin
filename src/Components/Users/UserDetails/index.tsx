"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { User } from "@/Types/Layout";
import { Fragment, useEffect, useState } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import CommonBreadcrumb from "@/CommonComponents/CommonBreadcrumb";
import TabProfile from "./TabProflle";
import Image from "next/image";

const UserDetail = ({ _id }: { _id: string }) => {
  const searchParams = useSearchParams();

  const ishide = searchParams.get("ishide");
  const email = searchParams.get("email");

  const orderInfo = searchParams.get("order");

  const [user, setUser] = useState<User | null>(null);
  const parsedOrderInfo = orderInfo ? JSON.parse(orderInfo) : null;

  console.log("parsedOrderInfo", parsedOrderInfo);

  useEffect(() => {
    const getUserDetail = async () => {
      type hideType = {
        email: string;
        city: string;
        first_name: string;
        last_name: string;
        phone: string;
        altPhone?: string;
        country: string;
        addressLine1: string;
        addressLine2?: string;
        landmark?: string;
        status?: string;
        postalCode: string;
        state: string;
      };
      try {
        const res = await fetch(`/api/user/${_id}`);
        const data = await res.json();
        if (ishide == "true") {
          const data2: User = {
            email: data?.email || "",
            city: parsedOrderInfo?.city || "",
            first_name: data?.first_name || "",
            last_name: data?.last_name || "",
            phone: parsedOrderInfo?.phone || "",
            altPhone: parsedOrderInfo?.altPhone || "",
            country: parsedOrderInfo?.country || "",
            addressLine1: parsedOrderInfo?.addressLine1 || "",
            addressLine2: parsedOrderInfo?.addressLine2 || "",
            landmark: parsedOrderInfo?.landmark || "",
            status: parsedOrderInfo?.status || "",
            postalCode: parsedOrderInfo?.postalCode || "",
            state: parsedOrderInfo?.state || "",
            role: "",
            profile_image: data?.profile_image,
            firstName: "",
            lastName: "",
            address_line1: "",
            address_type: "Home",
          };
          setUser(data2);
        } else {
          setUser(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUserDetail();
  }, [_id]);
  // console.log(user);

  // if (!user) return null;
  return (
    <Fragment>
      <CommonBreadcrumb title="User Detail" parent="users" />
      <Container fluid>
        {user ? (
          <Row>
            <Col xl="4">
              <Card>
                <CardBody>
                  <div className="profile-details text-center">
                    <>
                      <Image
                        src={user?.profile_image || ""}
                        alt=""
                        width={200}
                        height={200}
                        className="img-fluid img-90 rounded-circle blur-up lazyloaded"
                      />
                      <h5 className="f-w-600 f-16 mb-0">
                        {user?.first_name + " " + user?.last_name}
                      </h5>
                      <span>{user?.email}</span>
                    </>

                    {/* <div className="social">
                    <FormGroup className=" btn-showcase">
                      <a
                        target="_blank"
                        href="https://www.facebook.com/#"
                        className="btn social-btn btn-fb d-inline-flex"
                      >
                        <i className="fa fa-facebook"></i>
                      </a>
                      <a
                        target="_blank"
                        href="https://www.google.com/"
                        className="btn social-btn btn-twitter d-inline-flex"
                      >
                        <i className="fa fa-google"></i>
                      </a>
                      <a
                        target="_blank"
                        href="https://twitter.com/?lang=en"
                        className="btn social-btn btn-google d-inline-flex me-0"
                      >
                        <i className="fa fa-twitter"></i>
                      </a>
                    </FormGroup>
                  </div> */}
                  </div>
                  <hr />
                </CardBody>
              </Card>
            </Col>
            <Col xl="8">
              <Card className="profile-card">
                <CardBody>
                  <TabProfile ishide={ishide} user_id={_id} user={user} />
                </CardBody>
              </Card>
            </Col>
          </Row>
        ) : (
          "Loading.."
        )}
      </Container>
    </Fragment>
  );
};

export default UserDetail;
