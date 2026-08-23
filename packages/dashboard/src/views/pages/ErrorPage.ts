import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';
import css from '#src/views/pages/ErrorPage.scss?inline';

import '@neuralfog/hydris/navigation';
import '#src/views/components/icons/IconLogo';
import '#src/views/components/ui/badge/UiBadge';
import '#src/views/components/ui/button/UiButton';

export type ErrorData = {
    code: string;
    label: string;
    title: string;
    message: string;
};

// #component
export class ErrorPage extends Component<unknown, ErrorData> {
    // #styles
    styles = css;

    back = (): void => {
        history.back();
    };

    override template = (): Template => tpl`
        <div class="err">
            <div class="err-card">
                <a class="err-brand" href="/">
                    <icon-logo :size=${44} />
                    Flow
                </a>
                <ui-badge
                    :label=${this.viewData.label}
                    :variant=${'error'}
                    :dot=${true}
                    :pulse=${true}
                />
                <h1 class="err-code">${this.viewData.code}</h1>
                <h2 class="err-title">${this.viewData.title}</h2>
                <p class="err-desc">${this.viewData.message}</p>
                <div class="err-actions">
                    <ui-button
                        :label=${'Go back'}
                        :variant=${'outline'}
                        @click=${this.back}
                    />
                    <nav-link route="/">
                        <ui-button
                            :label=${'Take me home'}
                            :variant=${'primary'}
                        />
                    </nav-link>
                </div>
            </div>
        </div>
    `;
}
