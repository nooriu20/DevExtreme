import $ from '../../core/renderer';
import { isDefined } from '../../core/utils/type';

const WIDGET_CLASS = 'dx-widget';
const FIELD_ITEM_LABEL_TEXT_CLASS = 'dx-field-item-label-text';
const HIDDEN_LABEL_CLASS = 'dx-layout-manager-hidden-label';

const createItemPathByIndex = (index, isTabs) => `${isTabs ? 'tabs' : 'items'}[${index}]`;

const concatPaths = (path1, path2) => {
    if(isDefined(path1) && isDefined(path2)) {
        return `${path1}.${path2}`;
    }
    return path1 || path2;
};

const getTextWithoutSpaces = text => text ? text.replace(/\s/g, '') : undefined;

const isExpectedItem = (item, fieldName) => item && (item.dataField === fieldName || item.name === fieldName ||
    getTextWithoutSpaces(item.title) === fieldName || (item.itemType === 'group' && getTextWithoutSpaces(item.caption) === fieldName));

const getFullOptionName = (path, optionName) => `${path}.${optionName}`;

const getOptionNameFromFullName = fullName => {
    const parts = fullName.split('.');
    return parts[parts.length - 1].replace(/\[\d+]/, '');
};

const tryGetTabPath = fullPath => {
    const pathParts = fullPath.split('.');
    const resultPathParts = [...pathParts];

    for(let i = pathParts.length - 1; i >= 0; i--) {
        if(isFullPathContainsTabs(pathParts[i])) {
            return resultPathParts.join('.');
        }
        resultPathParts.splice(i, 1);
    }
    return '';
};

const isFullPathContainsTabs = fullPath => fullPath.indexOf('tabs') > -1;

const getItemPath = (items, item, isTabs) => {
    const index = items.indexOf(item);
    if(index > -1) {
        return createItemPathByIndex(index, isTabs);
    }
    for(let i = 0; i < items.length; i++) {
        const targetItem = items[i];
        const tabOrGroupItems = targetItem.tabs || targetItem.items;
        if(tabOrGroupItems) {
            const itemPath = getItemPath(tabOrGroupItems, item, targetItem.tabs);
            if(itemPath) {
                return concatPaths(createItemPathByIndex(i, isTabs), itemPath);
            }
        }
    }
};

const getLabelWidthByText = (text, layoutManager, labelLocation) => {
    const $hiddenContainer = $('<div>')
        .addClass(WIDGET_CLASS)
        .addClass(HIDDEN_LABEL_CLASS)
        .appendTo('body');

    const $label = layoutManager._renderLabel({
        text: ' ',
        location: labelLocation
    }).appendTo($hiddenContainer);

    const labelTextElement = $label.find('.' + FIELD_ITEM_LABEL_TEXT_CLASS)[0];

    // this code has slow performance
    labelTextElement.innerHTML = text;
    const result = labelTextElement.offsetWidth;

    $hiddenContainer.remove();

    return result;
};

exports.getOptionNameFromFullName = getOptionNameFromFullName;
exports.getFullOptionName = getFullOptionName;
exports.getTextWithoutSpaces = getTextWithoutSpaces;
exports.isExpectedItem = isExpectedItem;
exports.createItemPathByIndex = createItemPathByIndex;
exports.concatPaths = concatPaths;
exports.tryGetTabPath = tryGetTabPath;
exports.isFullPathContainsTabs = isFullPathContainsTabs;
exports.getItemPath = getItemPath;
exports.getLabelWidthByText = getLabelWidthByText;
