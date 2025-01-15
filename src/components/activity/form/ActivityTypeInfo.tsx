import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "../types";
import { TypeSelector } from "./type-selector/TypeSelector";
import { AgeRangeSelector } from "./age-selector/AgeRangeSelector";

interface ActivityTypeInfoProps {
  form: UseFormReturn<FormData>;
}

export function ActivityTypeInfo({ form }: ActivityTypeInfoProps) {
  return (
    <>
      <TypeSelector form={form} />
      <AgeRangeSelector form={form} />
    </>
  );
}