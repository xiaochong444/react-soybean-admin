import { SimpleScrollbar } from '@sa/materials';
import type { RouteRecordNormalized } from '@sa/simple-router';
import type { MenuInfo } from 'rc-menu/lib/interface';
import type { MenuProps } from 'antd';
import { getSiderCollapse } from '@/store/slice/app';
import { getThemeSettings } from '@/store/slice/theme';

interface LevelKeysProps {
  key?: string;
  children?: LevelKeysProps[];
}

const getLevelKeys = (items1: LevelKeysProps[]) => {
  const key: Record<string, number> = {};
  const func = (items2: LevelKeysProps[], level = 1) => {
    items2.forEach(item => {
      if (item.key) {
        key[item.key] = level;
      }
      if (item.children) {
        func(item.children, level + 1);
      }
    });
  };
  func(items1);
  return key;
};

const getSelectedMenuKeyPath = (matches: RouteRecordNormalized[]) => {
  const result = matches.reduce((acc: string[], match, index) => {
    if (index < matches.length - 1 && match.name) {
      acc.push(match.name);
    }
    return acc;
  }, []);

  return result;
};

const VerticalMenu = memo(() => {
  const { allMenus, childLevelMenus, selectKey, route } = useMixMenuContext();

  const levelKeys = useMemo(() => getLevelKeys(allMenus), [allMenus]);

  const themeSettings = useAppSelector(getThemeSettings);

  const router = useRouterPush();

  const openKeys = getSelectedMenuKeyPath(route.matched);

  const inlineCollapsed = useAppSelector(getSiderCollapse);

  const [stateOpenKeys, setStateOpenKeys] = useState<string[]>(openKeys);

  function handleClickMenu(menuInfo: MenuInfo) {
    router.menuPush(menuInfo.key);
  }

  const onOpenChange: MenuProps['onOpenChange'] = keys => {
    if (keys.includes('rc-menu-more')) {
      setStateOpenKeys(keys);
      return;
    }

    const currentOpenKey = keys.find(key => !stateOpenKeys.includes(key));

    // open
    if (currentOpenKey && themeSettings.isOnlyExpandCurrentParentMenu) {
      const repeatIndex = keys
        .filter(key => key !== currentOpenKey)
        .findIndex(key => levelKeys[key] === levelKeys[currentOpenKey]);

      setStateOpenKeys(
        keys
          // remove repeat key
          .filter((_, index) => index !== repeatIndex)
          // remove current level all child
          .filter(key => levelKeys[key] <= levelKeys[currentOpenKey])
      );
    } else {
      // close
      setStateOpenKeys(keys);
    }
  };

  return (
    <SimpleScrollbar>
      <AMenu
        mode="inline"
        items={themeSettings.layout.mode.includes('mix') ? childLevelMenus : allMenus}
        inlineCollapsed={inlineCollapsed}
        openKeys={stateOpenKeys}
        onOpenChange={onOpenChange}
        selectedKeys={selectKey}
        onSelect={handleClickMenu}
        className="size-full bg-container transition-300 border-0!"
        inlineIndent={18}
      />
    </SimpleScrollbar>
  );
});

export default VerticalMenu;