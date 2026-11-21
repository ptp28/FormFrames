import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableCellLayout,
  TableHeader,
  TableHeaderCell,
  TableRow,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { StarFilled, StarRegular } from '@fluentui/react-icons';
import { AnimatedFigure } from '../anim/Figure';
import type { Exercise } from '../data/exercises';
import { EquipmentBadge, SectionBadge } from './badges';
import { useMediaQuery } from '../hooks';

const useStyles = makeStyles({
  wrap: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusLarge,
    boxShadow: tokens.shadow4,
    overflow: 'hidden',
  },
  row: { cursor: 'pointer' },
  thumb: {
    width: '64px',
    height: '54px',
    flexShrink: 0,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground3,
    overflow: 'hidden',
  },
  chips: { display: 'flex', flexWrap: 'wrap', gap: tokens.spacingHorizontalXS },
  star: { color: tokens.colorPaletteMarigoldForeground1 },
});

export function ExerciseTable({
  items,
  playing,
  favorites,
  onToggleFavorite,
  onOpen,
}: {
  items: Exercise[];
  playing: boolean;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onOpen: (e: Exercise) => void;
}) {
  const s = useStyles();
  const narrow = useMediaQuery('(max-width: 720px)');
  return (
    <div className={s.wrap}>
      <Table aria-label="Exercises" size={narrow ? 'small' : 'medium'}>
        <TableHeader>
          <TableRow>
            <TableHeaderCell style={narrow ? { width: "58%" } : undefined}>Exercise</TableHeaderCell>
            {!narrow && <TableHeaderCell>Sections</TableHeaderCell>}
            <TableHeaderCell>Equipment</TableHeaderCell>
            {!narrow && <TableHeaderCell>Muscles</TableHeaderCell>}
            <TableHeaderCell style={{ width: 52 }} aria-label="Favorite" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((e) => {
            const fav = favorites.includes(e.id);
            return (
              <TableRow
                key={e.id}
                className={s.row}
                tabIndex={0}
                onClick={() => onOpen(e)}
                onKeyDown={(ev) => {
                  if (ev.key === 'Enter' || ev.key === ' ') {
                    ev.preventDefault();
                    onOpen(e);
                  }
                }}
              >
                <TableCell>
                  <TableCellLayout
                    media={
                      <div className={s.thumb}>
                        <AnimatedFigure anim={e.variants[0].anim} playing={playing} showHighlight={false} />
                      </div>
                    }
                    description={narrow ? e.sections.join(', ') : undefined}
                  >
                    {e.name}
                  </TableCellLayout>
                </TableCell>
                {!narrow && (
                  <TableCell>
                    <div className={s.chips}>
                      {e.sections.map((x) => (
                        <SectionBadge key={x} value={x} size="small" />
                      ))}
                    </div>
                  </TableCell>
                )}
                <TableCell>
                  <div className={s.chips}>
                    {e.equipment.map((x) => (
                      <EquipmentBadge key={x} value={x} size="small" />
                    ))}
                  </div>
                </TableCell>
                {!narrow && <TableCell>{e.muscles.join(', ')}</TableCell>}
                <TableCell>
                  <Button
                    appearance="transparent"
                    aria-label={fav ? `Remove ${e.name} from favorites` : `Add ${e.name} to favorites`}
                    aria-pressed={fav}
                    icon={fav ? <StarFilled className={s.star} /> : <StarRegular />}
                    onClick={(ev) => {
                      ev.stopPropagation();
                      onToggleFavorite(e.id);
                    }}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
