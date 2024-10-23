import { Separator } from '@/components/ui/separator';
import { EarlyForm } from './early-form';

export default function EarlyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Mint Access</h3>
        <p className="text-sm text-muted-foreground">
          Pause or unpause minting.
        </p>
      </div>
      <Separator />
      <EarlyForm />
    </div>
  );
}
