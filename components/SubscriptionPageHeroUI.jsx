"use client";
import React from "react";
import { HeroUIProvider, Button, Card, CardBody, CardHeader, Divider, Text, Spacer } from "@heroui/react";

const plans = [
  {
    name: "بداية",
    price: "500 ريال / شهر",
    features: [
      "تحليل منافسين أساسي",
      "100 محتوى شهري",
      "تقارير شهرية"
    ],
    color: "primary",
  },
  {
    name: "النمو",
    price: "1500 ريال / شهر",
    features: [
      "كل بداية",
      "مساعد مبيعات ذكي",
      "تحليل عملاء",
      "دعم أسبوعي"
    ],
    color: "success",
  },
  {
    name: "الشركات",
    price: "5000+ ريال / شهر",
    features: [
      "حلول مخصصة للشركات",
      "تكامل مع الأنظمة",
      "تدريب الفريق",
      "دعم 24/7"
    ],
    color: "warning",
  },
];

export default function SubscriptionPageHeroUI() {
  return (
    <HeroUIProvider locale="ar" theme="light">
      <div dir="rtl" style={{
        display: "flex",
        gap: 32,
        justifyContent: "center",
        flexWrap: "wrap",
        padding: "48px 0",
        background: "linear-gradient(120deg,#6366f1 0%,#ec4899 100%)"
      }}>
        {plans.map(plan => (
          <Card key={plan.name} className="max-w-[320px] min-h-[400px] shadow-xl" isBlurred>
            <CardHeader className={`flex flex-col items-center py-6`} style={{background: 'linear-gradient(90deg, rgba(99,102,241,1) 0%, rgba(236,72,153,1) 100%)'}}>
              <Text h2 className="text-white">{plan.name}</Text>
              <Text h4 className="text-white">{plan.price}</Text>
            </CardHeader>
            <Divider />
            <CardBody className="p-6">
              <ul className="mb-6 text-right" style={{paddingRight:8}}>
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="mb-2 text-md text-default-700">{feature}</li>
                ))}
              </ul>
              <Spacer y={2} />
              <Button color={plan.color} variant="shadow" size="lg" fullWidth>
                اشترك الآن
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </HeroUIProvider>
  );
}