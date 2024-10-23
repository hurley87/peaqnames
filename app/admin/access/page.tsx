import { Separator } from '@/components/ui/separator';
import { EarlyForm } from './early-form';

export default function EarlyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Early Mint Access</h3>
        <p className="text-sm text-muted-foreground">
          Update access to early minting.
        </p>
      </div>
      <Separator />
      <EarlyForm />
    </div>
  );
}
