import { Fragment } from 'react';
import { useTranslations } from 'next-intl';
import CodeBlock from '@/components/ui/CodeBlock';

export default function Solution() {
  const t = useTranslations('solution');
  const chat = t.raw('chat') as { prompt: string; reply: string }[];

  const config = `${t('configComment')}
import { defineApp } from "@fonderie/core";
import { auth } from "@fonderie/auth";
import { billing } from "@fonderie/billing";
import { workspaces } from "@fonderie/workspaces";

export default defineApp({
  modules: [
    auth({ oauth: ["google"], passkeys: true }),
    workspaces({ multiTenant: true }),
    billing({ provider: "stripe", seats: true }),
  ],
});`;

  const productLogic = `${t('logicComment')}
export const createSchedule = workspace.action(async (ctx, input) => {
  ${t('ctxComment')}
  return ctx.db.schedules.create(input);
});`;

  const mobileScreen = `${t('mobileComment')}
import { LoginScreen } from '@fonderie/screens/auth'

export function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  )
}`;

  return (
    <section className="solution">
      <p className="eyebrow" data-reveal="">
        {t('eyebrow')}
      </p>
      <h2 className="section-title solution__title" data-reveal="">
        {t('title')}
      </h2>

      <div className="solution__grid">
        <div>
          <div className="solution__chat">
            {chat.map((msg) => (
              <Fragment key={msg.prompt}>
                <div className="solution__bubble">{msg.prompt}</div>
                <div className="solution__reply">
                  <span className="solution__reply-label">{t('replyLabel')}</span>
                  {msg.reply}
                </div>
              </Fragment>
            ))}
          </div>
        </div>
        <div className="solution__panel">
          <p className="solution__panel-label">{t('codePanelLabel')}</p>
          <div className="solution__code">
            <CodeBlock code={config} />
          </div>
          <div className="solution__code">
            <CodeBlock code={`$ npx @fonderie/create my-saas\n${t('installComment')}`} lang="bash" />
          </div>
          <div className="solution__code solution__code--dim">
            <CodeBlock code={productLogic} />
          </div>
          <div className="solution__code">
            <CodeBlock code={mobileScreen} />
          </div>
        </div>
      </div>
    </section>
  );
}
