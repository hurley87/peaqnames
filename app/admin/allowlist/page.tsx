import { Separator } from '@/components/ui/separator';
import { AllowlistForm } from './allowlist-form';

export default function AllowlistPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Allowlist</h3>
        <p className="text-sm text-muted-foreground">
          Add recipients to the allowlist.
        </p>
      </div>
      <Separator />
      <AllowlistForm />
    </div>
  );
}
