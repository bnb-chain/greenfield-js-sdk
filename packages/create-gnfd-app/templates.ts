import { getTemplateUrl } from './helpers/get-template-url';
import { TemplateType } from './helpers/install-template';

export const TEMPLATES_MAP: Record<TemplateType, string> = {
  nextjs: getTemplateUrl('nextjs'),
  cra: getTemplateUrl('cra'),
  vite: getTemplateUrl('vite'),
};
