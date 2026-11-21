import { Badge, type BadgeProps } from '@fluentui/react-components';
import type { Equipment, Section } from '../data/exercises';

export const EQUIPMENT_COLOR: Record<Equipment, BadgeProps['color']> = {
  Machine: 'brand',
  Cable: 'informative',
  Dumbbell: 'success',
  Barbell: 'severe',
  Kettlebell: 'warning',
  Plate: 'important',
  Bodyweight: 'subtle',
  Cardio: 'danger',
};

export function EquipmentBadge({ value, size = 'medium' }: { value: Equipment; size?: BadgeProps['size'] }) {
  return (
    <Badge appearance="tint" shape="rounded" size={size} color={EQUIPMENT_COLOR[value]}>
      {value}
    </Badge>
  );
}

export function SectionBadge({ value, size = 'medium' }: { value: Section; size?: BadgeProps['size'] }) {
  return (
    <Badge appearance="outline" shape="rounded" size={size} color="informative">
      {value}
    </Badge>
  );
}
