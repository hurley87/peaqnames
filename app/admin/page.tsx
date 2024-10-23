import { Separator } from '@/components/ui/separator';
import { FeeForm } from './fee-form';

export default async function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Yearly Fee</h3>
        <p className="text-sm text-muted-foreground">
          Update the yearly mint fee.
        </p>
      </div>
      <Separator />
      <FeeForm />
    </div>
  );
}
