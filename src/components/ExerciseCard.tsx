import {
  Button,
  Caption1,
  Card,
  CardFooter,
  CardHeader,
  CardPreview,
  Text,
  Tooltip,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { StarFilled, StarRegular } from '@fluentui/react-icons';
import { AnimatedFigure } from '../anim/Figure';
import type { Exercise } from '../data/exercises';
import { EquipmentBadge } from './badges';

const useStyles = makeStyles({
  card: {
    height: '100%',
    transitionProperty: 'transform, box-shadow',
    transitionDuration: tokens.durationNormal,
    ':hover': { transform: 'translateY(-2px)', boxShadow: tokens.shadow16 },
    '@media (prefers-reduced-motion: reduce)': { transitionDuration: '0s', ':hover': { transform: 'none' } },
  },
  preview: {
    aspectRatio: '6 / 5',
    background: `linear-gradient(180deg, ${tokens.colorNeutralBackground2} 0%, ${tokens.colorNeutralBackground3} 100%)`,
    borderRadius: tokens.borderRadiusMedium,
    overflow: 'hidden',
  },
  name: { lineHeight: tokens.lineHeightBase300 },
  muscles: { color: tokens.colorNeutralForeground3 },
  footer: { flexWrap: 'wrap', gap: tokens.spacingHorizontalXS, marginTop: 'auto' },
  star: { color: tokens.colorPaletteMarigoldForeground1 },
});

export function ExerciseCard({
  exercise,
  playing,
  favorite,
  onToggleFavorite,
  onOpen,
  index,
}: {
  exercise: Exercise;
  playing: boolean;
  favorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpen: (e: Exercise) => void;
  index: number;
}) {
  const s = useStyles();
  return (
    <Card className={s.card} onClick={() => onOpen(exercise)} aria-label={`${exercise.name}. Open details`}>
      <CardPreview className={s.preview}>
        <AnimatedFigure anim={exercise.variants[0].anim} playing={playing} title={`${exercise.name} animation`} offset={(index % 5) * 0.37} />
      </CardPreview>
      <CardHeader
        header={
          <Text weight="semibold" size={400} className={s.name}>
            {exercise.name}
          </Text>
        }
        description={<Caption1 className={s.muscles}>{exercise.muscles.slice(0, 3).join(' · ')}</Caption1>}
        action={
          <Tooltip content={favorite ? 'Remove from favorites' : 'Add to favorites'} relationship="label">
            <Button
              appearance="transparent"
              icon={favorite ? <StarFilled className={s.star} /> : <StarRegular />}
              aria-pressed={favorite}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(exercise.id);
              }}
            />
          </Tooltip>
        }
      />
      <CardFooter className={s.footer}>
        {exercise.equipment.map((eq) => (
          <EquipmentBadge key={eq} value={eq} size="small" />
        ))}
      </CardFooter>
    </Card>
  );
}
