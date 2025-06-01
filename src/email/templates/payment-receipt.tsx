import { Tables } from "@/lib/supabase/types";
import { APPLICATION_NAME } from "@/utils/constants";
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

type PaymentWithProducts = Tables<"payments"> & {
  products: Tables<"products"> & {
    prices: Tables<"prices">[];
  };
};

const Email = (data: PaymentWithProducts) => {
  return (
    <Html lang="en" dir="ltr" style={{ fontFamily: "monospace" }}>
      <Head>
        <title>Payment Receipt</title>
      </Head>
      <Preview>Payment Receipt</Preview>
      <Body
        style={{
          width: "100%",
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
        }}
      >
        <Container
          style={{ background: "#FFF", width: "790px", maxWidth: "100%" }}
        >
          {/* =====HEADER===== */}
          <Section
            style={{
              width: "100%",
              height: "120px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Img
              src={`https://cdn.prod.website-files.com/67d012e8c7d76a09078b13c8/6811e55bba58a01477a1de7a_Reposible%20Logo.svg`}
              alt={`${APPLICATION_NAME} Logo`}
              style={{ width: "160px", height: "29px" }}
            />
          </Section>

          {/* =====CONTENT===== */}

          <Section style={{}}>
            {/* =====OPENING TEXT===== */}
            <Section style={{ height: "213px", padding: "30px 56px" }}>
              <Section
                style={{
                  height: "153px",
                  background: "#f5f5f7",
                  textAlign: "center",
                  borderRadius: "8px",
                }}
              >
                <Text
                  style={{
                    color: "#434343",
                    fontWeight: "600",
                    fontSize: "20px",
                    lineHeight: "24.2px",
                  }}
                >
                  We have received your payment of
                </Text>
                <Heading
                  as="h4"
                  style={{
                    fontWeight: "700",
                    fontSize: "24px",
                    lineHeight: "29.05px",
                  }}
                >
                  {data.quantity &&
                    `€ ${(data.quantity / 100).toFixed(2).replace(".", ",")}`}
                </Heading>
              </Section>
            </Section>

            <Section
              style={{
                maxWidth: "100%",
                justifyContent: "space-between",
                gap: "16px",
                padding: "18px 56px 48px 56px",
              }}
            >
              <Hr style={{ color: "#CBD5E1" }} />
              {/* ======ORDER SUMMARY TABLE====== */}
              <Section style={{}}>
                <Heading
                  as="h6"
                  style={{
                    fontWeight: "600",
                    fontSize: "18px",
                    lineHeight: "21.78px",
                    margin: "22px 0",
                  }}
                >
                  Order Summary
                </Heading>
                <Section
                  style={{
                    background: "#f5f5f7",
                    borderRadius: "8px",
                    gap: "16px",
                    padding: "24px",
                  }}
                >
                  <Row
                    key={data.products.id}
                    style={{
                      justifyContent: "space-between",
                      height: "24px",
                    }}
                  >
                    <Column
                      style={{
                        width: "377px",
                        color: "#434343",
                        fontSize: "16px",
                        fontWeight: "400",
                        lineHeight: "19.36px",
                      }}
                    >
                      {data.products.name}
                    </Column>
                    <Column
                      style={{
                        textAlign: "center",
                        width: "42px",
                        color: "#434343",
                        fontSize: "16px",
                        fontWeight: "500",
                        lineHeight: "24px",
                      }}
                    >
                      {data.products.prices[0].unit_amount &&
                        `€ ${(data.products.prices[0].unit_amount / 100)
                          .toFixed(2)
                          .replace(".", ",")}`}
                    </Column>
                    <Column
                      style={{
                        textAlign: "right",
                        width: "100px",
                        fontSize: "16px",
                        fontWeight: "600",
                        lineHeight: "19.36px",
                      }}
                    >
                      1
                    </Column>
                  </Row>
                </Section>
              </Section>

              <Hr style={{ marginTop: "32px" }} />

              {/* =====PAYMENT DETAILS TABLE======= */}
              <Section>
                <Heading
                  as="h6"
                  style={{
                    fontWeight: "600",
                    fontSize: "18px",
                    lineHeight: "21.78px",
                    margin: "22px 0",
                  }}
                >
                  Payment Details
                </Heading>
                <Section
                  style={{
                    background: "#f5f5f7",
                    borderRadius: "8px",
                    gap: "16px",
                    padding: "24px",
                  }}
                >
                  <Row
                    style={{
                      justifyContent: "space-between",
                      height: "24px",
                    }}
                  >
                    <Column
                      style={{
                        width: "377px",
                        color: "#434343",
                        fontSize: "16px",
                        fontWeight: "400",
                        lineHeight: "19.36px",
                      }}
                    >
                      Amount
                    </Column>
                    <Column
                      style={{
                        textAlign: "right",
                        width: "100px",
                        fontSize: "16px",
                        fontWeight: "600",
                        lineHeight: "19.36px",
                      }}
                    >
                      {data.products.prices[0].unit_amount &&
                        `€ ${(data.products.prices[0].unit_amount / 100)
                          .toFixed(2)
                          .replace(".", ",")}`}
                    </Column>
                  </Row>
                  <Hr />
                  <Row>
                    <Column
                      style={{
                        width: "377px",
                        color: "#434343",
                        fontSize: "16px",
                        fontWeight: "400",
                        lineHeight: "19.36px",
                      }}
                    >
                      Reference ID
                    </Column>
                    <Column
                      style={{
                        textAlign: "right",
                        width: "100px",
                        fontSize: "16px",
                        fontWeight: "600",
                        lineHeight: "19.36px",
                      }}
                    >
                      {data.id}
                    </Column>
                  </Row>
                  <Hr />
                  <Row>
                    <Column
                      style={{
                        width: "377px",
                        color: "#434343",
                        fontSize: "16px",
                        fontWeight: "400",
                        lineHeight: "19.36px",
                      }}
                    >
                      Date
                    </Column>
                    <Column
                      style={{
                        textAlign: "right",
                        width: "100px",
                        fontSize: "16px",
                        fontWeight: "600",
                        lineHeight: "19.36px",
                      }}
                    >
                      {new Date(data.created_at).toLocaleDateString("en-GB")}
                    </Column>
                  </Row>
                </Section>
              </Section>

              <Hr style={{ marginTop: "32px" }} />

              {/* ====CONTACT/REGARDS ======*/}
              <Section>
                <Heading
                  style={{
                    fontWeight: "600",
                    fontSize: "16px",
                    lineHeight: "24px",
                  }}
                >
                  Have any questions about your order?
                </Heading>
                <Text
                  style={{
                    fontWeight: "400",
                    fontSize: "14px",
                    lineHeight: "16.94px",
                  }}
                >
                  Email us at{" "}
                  <span style={{ fontWeight: "600" }}>hello@reposible.com</span>
                </Text>
              </Section>
              <Section>
                <Text
                  style={{
                    fontWeight: "600",
                    fontSize: "14px",
                    lineHeight: "16.94px",
                  }}
                >
                  Regards,
                </Text>
                <Text
                  style={{
                    fontWeight: "600",
                    fontSize: "14px",
                    lineHeight: "16.94px",
                  }}
                >
                  The {APPLICATION_NAME} Team
                </Text>
              </Section>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default Email;
