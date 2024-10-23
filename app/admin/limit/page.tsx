import { Separator } from '@/components/ui/separator';
import { LimitForm } from './limit-form';

export default function MintLimitPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Mint Limit</h3>
        <p className="text-sm text-muted-foreground">
          Update the mint limit for early minting.
        </p>
      </div>
      <Separator />
      <LimitForm />
    </div>
  );
}
