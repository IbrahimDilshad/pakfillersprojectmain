
'use client';
import { Form } from '@/components/ui/form';
import { BusinessIncomeForm } from './business-income-form';

export function TraderShopForm({ form: passedForm, businessType }: { form: any, businessType: string }) {
    return (
        <Form {...passedForm}>
            <BusinessIncomeForm form={passedForm} incomeType={businessType} basePath={`businessDetails.${businessType}`} />
        </Form>
    )
}
