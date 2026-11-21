import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import {
  Body1,
  Button,
  Caption1,
  CounterBadge,
  Divider,
  Dropdown,
  FluentProvider,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuGroupHeader,
  MenuItem,
  MenuItemCheckbox,
  MenuItemRadio,
  MenuList,
  MenuPopover,
  MenuTrigger,
  MessageBar,
  MessageBarActions,
  MessageBarBody,
  MessageBarTitle,
  Option,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  SearchBox,
  Subtitle2,
  Switch,
  Tab,
  TabList,
  Tag,
  TagGroup,
  Text,
  Title3,
  Toast,
  ToastTitle,
  Toaster,
  ToggleButton,
  Toolbar,
  ToolbarDivider,
  ToolbarRadioButton,
  ToolbarRadioGroup,
  Tooltip,
  makeStyles,
  tokens,
  useId,
  useToastController,
  webDarkTheme,
  webLightTheme,
} from '@fluentui/react-components';
import {
  ArrowSortRegular,
  FilterRegular,
  GridRegular,
  InfoRegular,
  StarFilled,
  StarRegular,
  TableRegular,
  WeatherMoonRegular,
  WeatherSunnyRegular,
} from '@fluentui/react-icons';
import { EQUIPMENT, EXERCISES, SECTIONS, searchText, type Equipment, type Exercise, type Section } from './data/exercises';
import { ExerciseCard } from './components/ExerciseCard';
import { ExerciseTable } from './components/ExerciseTable';
import { ExerciseDrawer } from './components/ExerciseDrawer';
import { EquipmentBadge } from './components/badges';
import { useMediaQuery, useStoredState } from './hooks';

type Tab = 'All' | Section;
type Sort = 'list' | 'az' | 'za';
type View = 'grid' | 'table';

const useStyles = makeStyles({
  app: {
    minHeight: '100vh',
    backgroundColor: tokens.colorNeutralBackground2,
    color: tokens.colorNeutralForeground1,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    boxShadow: tokens.shadow2,
  },
  headerInner: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: `${tokens.spacingVerticalM} 24px`,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalL,
    flexWrap: 'wrap',
    '@media (max-width: 640px)': { padding: `${tokens.spacingVerticalS} 16px`, gap: tokens.spacingHorizontalS },
  },
  brand: { display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalM, marginRight: 'auto' },
  brandText: { display: 'flex', flexDirection: 'column' },
  tagline: { color: tokens.colorNeutralForeground3, '@media (max-width: 640px)': { display: 'none' } },
  search: {
    width: '340px',
    maxWidth: '100%',
    '@media (max-width: 640px)': { order: 3, width: '100%' },
  },
  tabsRow: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 24px',
    overflowX: 'auto',
    scrollbarWidth: 'none',
  },
  main: {
    width: '100%',
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '20px 24px 48px',
    boxSizing: 'border-box',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    '@media (max-width: 640px)': { padding: '12px 16px 40px' },
  },
  toolbarRow: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  toolbar: { flexWrap: 'wrap', padding: 0, gap: tokens.spacingHorizontalXS },
  sectionDropdown: { minWidth: '150px' },
  filters: { display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalS, flexWrap: 'wrap' },
  count: { color: tokens.colorNeutralForeground3 },
  sectionHead: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    marginTop: tokens.spacingVerticalS,
    marginBottom: tokens.spacingVerticalM,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
    gap: '16px',
    '@media (max-width: 520px)': { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '10px' },
  },
  groups: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalXXL },
  footer: {
    textAlign: 'center',
    padding: '20px 16px 28px',
    color: tokens.colorNeutralForeground3,
  },
  popover: { maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalS },
  legendRow: { display: 'flex', flexWrap: 'wrap', gap: tokens.spacingHorizontalXS },
  star: { color: tokens.colorPaletteMarigoldForeground1 },
});

const SORT_LABEL: Record<Sort, string> = { list: 'My order', az: 'Name A–Z', za: 'Name Z–A' };

export function App() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [themePref, setThemePref] = useStoredState<'light' | 'dark' | null>('ea.theme', null);
  const dark = themePref ? themePref === 'dark' : prefersDark;

  return (
    <FluentProvider theme={dark ? webDarkTheme : webLightTheme}>
      <Shell dark={dark} onToggleTheme={() => setThemePref(dark ? 'light' : 'dark')} reducedMotion={reducedMotion} />
    </FluentProvider>
  );
}

function Shell({ dark, onToggleTheme, reducedMotion }: { dark: boolean; onToggleTheme: () => void; reducedMotion: boolean }) {
  const s = useStyles();
  const mobile = useMediaQuery('(max-width: 640px)');
  const toasterId = useId('toaster');
  const { dispatchToast } = useToastController(toasterId);
  const searchRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [tab, setTab] = useStoredState<Tab>('ea.tab', 'All');
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [favOnly, setFavOnly] = useState(false);
  const [sort, setSort] = useStoredState<Sort>('ea.sort', 'list');
  const [view, setView] = useStoredState<View>('ea.view', 'grid');
  const [animate, setAnimate] = useStoredState<boolean | null>('ea.animate', null);
  const playing = animate ?? !reducedMotion;
  const [favorites, setFavorites] = useStoredState<string[]>('ea.favorites', []);
  const [openId, setOpenId] = useState<string | null>(() => decodeURIComponent(location.hash.slice(1)) || null);
  const [drawerOpen, setDrawerOpen] = useState(() => !!EXERCISES.find((e) => e.id === decodeURIComponent(location.hash.slice(1))));

  const opened = EXERCISES.find((e) => e.id === openId) ?? null;

  // Deep links: #exercise-id opens the details drawer
  useEffect(() => {
    const onHash = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      if (EXERCISES.some((e) => e.id === id)) {
        setOpenId(id);
        setDrawerOpen(true);
      } else setDrawerOpen(false);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // "/" focuses search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(t.tagName) && !t.isContentEditable) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const openExercise = useCallback((e: Exercise) => {
    setOpenId(e.id);
    setDrawerOpen(true);
    history.replaceState(null, '', `#${e.id}`);
  }, []);
  const closeExercise = useCallback(() => {
    setDrawerOpen(false);
    history.replaceState(null, '', location.pathname + location.search);
  }, []);

  const toggleFavorite = useCallback(
    (id: string) => {
      const ex = EXERCISES.find((e) => e.id === id)!;
      const on = !favorites.includes(id);
      setFavorites((prev) => (on ? [...prev.filter((x) => x !== id), id] : prev.filter((x) => x !== id)));
      dispatchToast(
        <Toast>
          <ToastTitle>{on ? `Added “${ex.name}” to favorites` : `Removed “${ex.name}” from favorites`}</ToastTitle>
        </Toast>,
        { intent: on ? 'success' : 'info', timeout: 2200 },
      );
    },
    [dispatchToast, favorites, setFavorites],
  );

  // Filtering (everything except the section tab), used for the tab counters too
  const filtered = useMemo(() => {
    const terms = deferredQuery.toLowerCase().split(/\s+/).filter(Boolean);
    let list = EXERCISES.filter((e) => {
      const hay = searchText(e);
      return (
        terms.every((t) => hay.includes(t)) &&
        (equipment.length === 0 || e.equipment.some((x) => equipment.includes(x))) &&
        (!favOnly || favorites.includes(e.id))
      );
    });
    if (sort !== 'list') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name) * (sort === 'az' ? 1 : -1));
    }
    return list;
  }, [deferredQuery, equipment, favOnly, favorites, sort]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: filtered.length };
    SECTIONS.forEach((sec) => (c[sec] = filtered.filter((e) => e.sections.includes(sec)).length));
    return c;
  }, [filtered]);

  const groups: { section: Section; items: Exercise[] }[] = (tab === 'All' ? [...SECTIONS] : [tab])
    .map((section) => ({ section, items: filtered.filter((e) => e.sections.includes(section)) }))
    .filter((g) => g.items.length > 0);

  const anyFilter = query !== '' || equipment.length > 0 || favOnly;
  const clearAll = () => {
    setQuery('');
    setEquipment([]);
    setFavOnly(false);
  };
  const shownCount = tab === 'All' ? filtered.length : counts[tab];

  const tabs: Tab[] = ['All', ...SECTIONS];

  return (
    <div className={s.app}>
      <header className={s.header}>
        <div className={s.headerInner}>
          <div className={s.brand}>
            <img src="./favicon.svg" alt="" width={40} height={40} style={{ borderRadius: 8, flexShrink: 0 }} />
            <div className={s.brandText}>
              <Title3 as="h1">FormFrames</Title3>
              <Caption1 className={s.tagline}>{EXERCISES.length} exercises · animated · searchable</Caption1>
            </div>
          </div>
          <SearchBox
            ref={searchRef}
            className={s.search}
            placeholder="Search exercises, muscles, equipment…  ( / )"
            value={query}
            onChange={(_, d) => setQuery(d.value)}
            aria-label="Search exercises"
          />
          <Popover withArrow positioning="below-end">
            <PopoverTrigger disableButtonEnhancement>
              <Tooltip content="About & legend" relationship="label">
                <Button appearance="subtle" icon={<InfoRegular />} />
              </Tooltip>
            </PopoverTrigger>
            <PopoverSurface className={s.popover}>
              <Subtitle2>How to use</Subtitle2>
              <Body1>
                Pick a muscle group, search by name, muscle or equipment, and tap any exercise for a large animation with step-by-step
                instructions. The <b>red</b> parts of the figure are the muscles being worked.
              </Body1>
              <Divider />
              <Caption1>Equipment tags</Caption1>
              <div className={s.legendRow}>
                {EQUIPMENT.map((x) => (
                  <EquipmentBadge key={x} value={x} size="small" />
                ))}
              </div>
              <Caption1>Favorites and settings are saved in this browser only.</Caption1>
            </PopoverSurface>
          </Popover>
          <Tooltip content={dark ? 'Switch to light theme' : 'Switch to dark theme'} relationship="label">
            <Button appearance="subtle" icon={dark ? <WeatherSunnyRegular /> : <WeatherMoonRegular />} onClick={onToggleTheme} />
          </Tooltip>
        </div>
        {!mobile && (
          <div className={s.tabsRow}>
            <TabList selectedValue={tab} onTabSelect={(_, d) => setTab(d.value as Tab)} aria-label="Muscle groups">
              {tabs.map((t) => (
                <Tab key={t} value={t}>
                  {t}&nbsp;
                  <CounterBadge count={counts[t]} showZero size="small" appearance="ghost" color="informative" />
                </Tab>
              ))}
            </TabList>
          </div>
        )}
      </header>

      <main className={s.main}>
        <div className={s.toolbarRow}>
          <Toolbar
            className={s.toolbar}
            aria-label="Filters and view"
            checkedValues={{ view: [view] }}
            onCheckedValueChange={(_, d) => d.name === 'view' && setView(d.checkedItems[0] as View)}
          >
            {mobile && (
              <Dropdown
                className={s.sectionDropdown}
                aria-label="Muscle group"
                value={`${tab} (${counts[tab]})`}
                selectedOptions={[tab]}
                onOptionSelect={(_, d) => setTab(d.optionValue as Tab)}
              >
                {tabs.map((t) => (
                  <Option key={t} value={t} text={`${t} (${counts[t]})`}>
                    {`${t} (${counts[t]})`}
                  </Option>
                ))}
              </Dropdown>
            )}
            <Menu
              checkedValues={{ equipment }}
              onCheckedValueChange={(_, d) => setEquipment(d.checkedItems as Equipment[])}
            >
              <MenuTrigger disableButtonEnhancement>
                <MenuButton icon={<FilterRegular />} appearance="subtle">
                  Equipment{equipment.length ? ` (${equipment.length})` : ''}
                </MenuButton>
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  <MenuGroup>
                    <MenuGroupHeader>Show exercises using</MenuGroupHeader>
                    {EQUIPMENT.map((x) => (
                      <MenuItemCheckbox key={x} name="equipment" value={x}>
                        {x}
                      </MenuItemCheckbox>
                    ))}
                  </MenuGroup>
                  <MenuDivider />
                  <MenuItem disabled={!equipment.length} onClick={() => setEquipment([])}>
                    Clear equipment filter
                  </MenuItem>
                </MenuList>
              </MenuPopover>
            </Menu>
            <Menu checkedValues={{ sort: [sort] }} onCheckedValueChange={(_, d) => setSort(d.checkedItems[0] as Sort)}>
              <MenuTrigger disableButtonEnhancement>
                <MenuButton icon={<ArrowSortRegular />} appearance="subtle">
                  {mobile ? 'Sort' : SORT_LABEL[sort]}
                </MenuButton>
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  {(Object.keys(SORT_LABEL) as Sort[]).map((k) => (
                    <MenuItemRadio key={k} name="sort" value={k}>
                      {SORT_LABEL[k]}
                    </MenuItemRadio>
                  ))}
                </MenuList>
              </MenuPopover>
            </Menu>
            <ToggleButton
              appearance="subtle"
              checked={favOnly}
              icon={favOnly ? <StarFilled className={s.star} /> : <StarRegular />}
              onClick={() => setFavOnly((v) => !v)}
            >
              Favorites{favorites.length ? ` (${favorites.length})` : ''}
            </ToggleButton>
            <ToolbarDivider />
            <ToolbarRadioGroup aria-label="Layout">
              <Tooltip content="Card grid" relationship="label">
                <ToolbarRadioButton name="view" value="grid" appearance="subtle" icon={<GridRegular />} />
              </Tooltip>
              <Tooltip content="Table" relationship="label">
                <ToolbarRadioButton name="view" value="table" appearance="subtle" icon={<TableRegular />} />
              </Tooltip>
            </ToolbarRadioGroup>
          </Toolbar>
          <Switch label="Animate" checked={playing} onChange={(_, d) => setAnimate(d.checked)} />
        </div>

        {anyFilter && (
          <div className={s.filters}>
            <Text className={s.count}>
              {shownCount} result{shownCount === 1 ? '' : 's'}
            </Text>
            <TagGroup
              aria-label="Active filters"
              onDismiss={(_, d) => {
                const v = String(d.value);
                if (v === 'q') setQuery('');
                else if (v === 'fav') setFavOnly(false);
                else setEquipment((prev) => prev.filter((x) => x !== v.slice(3)));
              }}
            >
              {query && (
                <Tag value="q" dismissible dismissIcon={{ 'aria-label': 'Clear search' }} size="small">
                  “{query}”
                </Tag>
              )}
              {equipment.map((x) => (
                <Tag key={x} value={`eq:${x}`} dismissible dismissIcon={{ 'aria-label': `Remove ${x}` }} size="small">
                  {x}
                </Tag>
              ))}
              {favOnly && (
                <Tag value="fav" dismissible dismissIcon={{ 'aria-label': 'Show all' }} size="small" icon={<StarFilled />}>
                  Favorites
                </Tag>
              )}
            </TagGroup>
            <Link as="button" onClick={clearAll}>
              Clear all
            </Link>
          </div>
        )}

        {groups.length === 0 ? (
          <MessageBar intent={favOnly && favorites.length === 0 ? 'info' : 'warning'}>
            <MessageBarBody>
              <MessageBarTitle>{favOnly && favorites.length === 0 ? 'No favorites yet' : 'No exercises found'}</MessageBarTitle>
              {favOnly && favorites.length === 0
                ? 'Tap the star on any exercise to save it here.'
                : 'Try a different search term, muscle group, or equipment filter.'}
            </MessageBarBody>
            <MessageBarActions>
              <Button onClick={clearAll}>Clear filters</Button>
            </MessageBarActions>
          </MessageBar>
        ) : (
          <div className={s.groups}>
            {groups.map((g) => (
              <section key={g.section} aria-labelledby={`sec-${g.section}`}>
                {(tab === 'All' || view === 'grid') && (
                  <div className={s.sectionHead}>
                    <Subtitle2 as="h2" id={`sec-${g.section}`}>
                      {g.section}
                    </Subtitle2>
                    <CounterBadge count={g.items.length} size="small" appearance="filled" color="brand" />
                    <Divider style={{ flexGrow: 1 }} />
                  </div>
                )}
                {view === 'grid' ? (
                  <div className={s.grid}>
                    {g.items.map((e, i) => (
                      <ExerciseCard
                        key={e.id}
                        index={i}
                        exercise={e}
                        playing={playing}
                        favorite={favorites.includes(e.id)}
                        onToggleFavorite={toggleFavorite}
                        onOpen={openExercise}
                      />
                    ))}
                  </div>
                ) : (
                  <ExerciseTable
                    items={g.items}
                    playing={playing}
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                    onOpen={openExercise}
                  />
                )}
              </section>
            ))}
          </div>
        )}
      </main>

      <footer className={s.footer}>
        <Caption1>FormFrames · every move, frame by frame · runs entirely in your browser</Caption1>
      </footer>

      <ExerciseDrawer
        exercise={opened}
        open={drawerOpen && !!opened}
        onClose={closeExercise}
        favorite={!!opened && favorites.includes(opened.id)}
        onToggleFavorite={toggleFavorite}
      />
      <Toaster toasterId={toasterId} position={mobile ? 'bottom' : 'bottom-end'} />
    </div>
  );
}
