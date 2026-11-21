import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  Body1,
  Button,
  Caption1,
  Divider,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  Field,
  InfoLabel,
  MessageBar,
  MessageBarBody,
  OverlayDrawer,
  Slider,
  Tab,
  TabList,
  Tag,
  TagGroup,
  ToggleButton,
  Tooltip,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { DismissRegular, PauseRegular, PlayRegular, StarFilled, StarRegular } from '@fluentui/react-icons';
import { AnimatedFigure } from '../anim/Figure';
import type { Exercise } from '../data/exercises';
import { EquipmentBadge, SectionBadge } from './badges';
import { useMediaQuery } from '../hooks';

const useStyles = makeStyles({
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    paddingBottom: tokens.spacingVerticalXXL,
    overflowX: 'hidden',
    '& > *': { flexShrink: 0 },
  },
  stage: {
    aspectRatio: '6 / 5',
    width: '100%',
    maxHeight: '52vh',
    flexShrink: 0,
    boxSizing: 'border-box',
    borderRadius: tokens.borderRadiusXLarge,
    background: `radial-gradient(circle at 50% 35%, ${tokens.colorNeutralBackground1} 0%, ${tokens.colorNeutralBackground3} 100%)`,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    overflow: 'hidden',
  },
  controls: { display: 'flex', alignItems: 'flex-end', gap: tokens.spacingHorizontalL, flexWrap: 'wrap' },
  slider: { flexGrow: 1, minWidth: '160px' },
  badges: { display: 'flex', flexWrap: 'wrap', gap: tokens.spacingHorizontalXS },
  summary: { color: tokens.colorNeutralForeground2 },
  list: { margin: 0, paddingLeft: '1.3em', display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalS },
  legend: { display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalS, color: tokens.colorNeutralForeground3 },
  swatch: { width: '12px', height: '12px', borderRadius: '50%', backgroundColor: tokens.colorPaletteRedBackground3 },
  star: { color: tokens.colorPaletteMarigoldForeground1 },
});

export function ExerciseDrawer({
  exercise,
  open,
  onClose,
  favorite,
  onToggleFavorite,
}: {
  exercise: Exercise | null;
  open: boolean;
  onClose: () => void;
  favorite: boolean;
  onToggleFavorite: (id: string) => void;
}) {
  const s = useStyles();
  const mobile = useMediaQuery('(max-width: 640px)');
  const [variant, setVariant] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    setVariant(0);
    setPlaying(true);
  }, [exercise?.id]);

  return (
    <OverlayDrawer
      open={open}
      onOpenChange={(_, d) => !d.open && onClose()}
      position={mobile ? 'bottom' : 'end'}
      size={mobile ? 'full' : 'medium'}
      aria-label={exercise ? `${exercise.name} details` : 'Exercise details'}
    >
      {exercise && (
        <>
          <DrawerHeader>
            <DrawerHeaderTitle
              action={
                <>
                  <Tooltip content={favorite ? 'Remove from favorites' : 'Add to favorites'} relationship="label">
                    <ToggleButton
                      appearance="subtle"
                      checked={favorite}
                      icon={favorite ? <StarFilled className={s.star} /> : <StarRegular />}
                      onClick={() => onToggleFavorite(exercise.id)}
                    />
                  </Tooltip>
                  <Button appearance="subtle" aria-label="Close" icon={<DismissRegular />} onClick={onClose} />
                </>
              }
            >
              {exercise.name}
            </DrawerHeaderTitle>
          </DrawerHeader>
          <DrawerBody className={s.body}>
            <div className={s.badges}>
              {exercise.sections.map((x) => (
                <SectionBadge key={x} value={x} />
              ))}
              {exercise.equipment.map((x) => (
                <EquipmentBadge key={x} value={x} />
              ))}
            </div>

            {exercise.variants.length > 1 && (
              <TabList selectedValue={String(variant)} onTabSelect={(_, d) => setVariant(Number(d.value))} size="small" appearance="subtle-circular">
                {exercise.variants.map((v, i) => (
                  <Tab key={v.label} value={String(i)}>
                    {v.label}
                  </Tab>
                ))}
              </TabList>
            )}

            <div className={s.stage}>
              <AnimatedFigure
                key={`${exercise.id}-${variant}`}
                anim={exercise.variants[variant].anim}
                playing={playing}
                speed={speed}
                title={`${exercise.name} (${exercise.variants[variant].label}) animation`}
              />
            </div>

            <div className={s.controls}>
              <Button
                appearance="primary"
                icon={playing ? <PauseRegular /> : <PlayRegular />}
                onClick={() => setPlaying((p) => !p)}
              >
                {playing ? 'Pause' : 'Play'}
              </Button>
              <Field label={`Speed: ${speed.toFixed(2).replace(/0$/, '')}×`} className={s.slider}>
                <Slider min={0.25} max={2} step={0.25} value={speed} onChange={(_, d) => setSpeed(d.value)} />
              </Field>
            </div>
            <div className={s.legend}>
              <span className={s.swatch} />
              <Caption1>Highlighted = target muscles</Caption1>
            </div>

            <Body1 className={s.summary}>{exercise.summary}</Body1>

            {exercise.sections.length > 1 && (
              <MessageBar intent="info">
                <MessageBarBody>This exercise appears in {exercise.sections.length} sections: {exercise.sections.join(', ')}.</MessageBarBody>
              </MessageBar>
            )}

            <Divider />

            <Accordion multiple collapsible defaultOpenItems={['how', 'tips']}>
              <AccordionItem value="how">
                <AccordionHeader size="large">How to do it</AccordionHeader>
                <AccordionPanel>
                  <ol className={s.list}>
                    {exercise.steps.map((x) => (
                      <li key={x}>
                        <Body1>{x}</Body1>
                      </li>
                    ))}
                  </ol>
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem value="tips">
                <AccordionHeader size="large">Tips</AccordionHeader>
                <AccordionPanel>
                  <ul className={s.list}>
                    {exercise.tips.map((x) => (
                      <li key={x}>
                        <Body1>{x}</Body1>
                      </li>
                    ))}
                  </ul>
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem value="muscles">
                <AccordionHeader size="large">
                  <InfoLabel info="Primary muscles first, then the ones that assist.">Muscles worked</InfoLabel>
                </AccordionHeader>
                <AccordionPanel>
                  <TagGroup aria-label="Muscles worked">
                    {exercise.muscles.map((m) => (
                      <Tag key={m} size="small" appearance="brand">
                        {m}
                      </Tag>
                    ))}
                  </TagGroup>
                </AccordionPanel>
              </AccordionItem>
              {exercise.aka.length > 0 && (
                <AccordionItem value="aka">
                  <AccordionHeader size="large">Also known as</AccordionHeader>
                  <AccordionPanel>
                    <TagGroup aria-label="Other names">
                      {exercise.aka.map((m) => (
                        <Tag key={m} size="small" appearance="outline">
                          {m}
                        </Tag>
                      ))}
                    </TagGroup>
                  </AccordionPanel>
                </AccordionItem>
              )}
            </Accordion>
          </DrawerBody>
        </>
      )}
    </OverlayDrawer>
  );
}
