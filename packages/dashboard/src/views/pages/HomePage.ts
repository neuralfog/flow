import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';
import css from '#src/views/pages/HomePage.scss?inline';

import '#src/views/layouts/DashboardLayout';
import '#src/views/components/ui/button/UiButton';
import '#src/views/components/ui/button/UiButtonGroup';
import '#src/views/components/ui/badge/UiBadge';
import '#src/views/components/ui/card/UiCard';
import '#src/views/components/ui/input/UiInput';
import '#src/views/components/ui/input/UiInputGroup';
import '#src/views/components/ui/scrollable/UiScrollable';
import '#src/views/components/icons/IconLogo';
import '#src/views/components/ui/table/UiTable';
import '#src/views/components/ui/table/UiTableHead';
import '#src/views/components/ui/table/UiTableBody';
import '#src/views/components/ui/table/UiTableRow';
import '#src/views/components/ui/table/UiTableHeadCell';
import '#src/views/components/ui/table/UiTableCell';

// #component
export class HomePage extends Component {
    // #styles
    styles = css;

    override template = (): Template => tpl`
        <dashboard-layout>
            <h1 class="title">Components</h1>
            <p class="subtitle">Flow dashboard design system</p>
            <div class="section">
                <h2>Logo</h2>
                <div class="row" style="align-items: center; gap: 1rem">
                    <icon-logo :size=${64} />
                    <icon-logo :size=${40} />
                    <icon-logo :size=${24} />
                </div>
            </div>
            <div class="section">
                <h2>Buttons</h2>
                <div class="row" style="margin-bottom: 1rem">
                    <ui-button :label=${'Primary'} :variant=${'primary'} />
                    <ui-button :label=${'Secondary'} :variant=${'secondary'} />
                    <ui-button :label=${'Outline'} :variant=${'outline'} />
                    <ui-button
                        :label=${'Disabled'}
                        :variant=${'primary'}
                        :disabled=${true}
                    />
                </div>
                <div class="row">
                    <ui-button
                        :label=${'Primary'}
                        :variant=${'primary'}
                        :size=${'sm'}
                    />
                    <ui-button
                        :label=${'Secondary'}
                        :variant=${'secondary'}
                        :size=${'sm'}
                    />
                    <ui-button
                        :label=${'Outline'}
                        :variant=${'outline'}
                        :size=${'sm'}
                    />
                </div>
            </div>
            <div class="section">
                <h2>Button group</h2>
                <div class="row" style="margin-bottom: 1rem">
                    <ui-button-group>
                        <ui-button :label=${'Day'} :variant=${'secondary'} />
                        <ui-button :label=${'Week'} :variant=${'secondary'} />
                        <ui-button :label=${'Month'} :variant=${'secondary'} />
                    </ui-button-group>
                </div>
                <div class="row" style="margin-bottom: 1rem">
                    <ui-button-group>
                        <ui-button
                            :label=${'Day'}
                            :variant=${'secondary'}
                            :size=${'sm'}
                        />
                        <ui-button
                            :label=${'Week'}
                            :variant=${'secondary'}
                            :size=${'sm'}
                        />
                        <ui-button
                            :label=${'Month'}
                            :variant=${'secondary'}
                            :size=${'sm'}
                        />
                    </ui-button-group>
                </div>
                <div class="row">
                    <ui-button-group>
                        <ui-button :label=${'Save'} :variant=${'primary'} />
                        <ui-button :label=${'Draft'} :variant=${'secondary'} />
                        <ui-button
                            :label=${'Locked'}
                            :variant=${'secondary'}
                            :disabled=${true}
                        />
                    </ui-button-group>
                </div>
            </div>
            <div class="section">
                <h2>Badges</h2>
                <div class="row">
                    <ui-badge :label=${'completed'} :tone=${'ok'} />
                    <ui-badge
                        :label=${'running'}
                        :tone=${'info'}
                        :pulse=${true}
                    />
                    <ui-badge :label=${'scheduled'} :tone=${'neutral'} />
                    <ui-badge :label=${'timed_out'} :tone=${'warn'} />
                    <ui-badge :label=${'failed'} :tone=${'err'} />
                </div>
            </div>
            <div class="section">
                <h2>Input</h2>
                <div class="row" style="margin-bottom: 1rem">
                    <ui-input :placeholder=${'Search jobs...'} />
                    <ui-button :label=${'Search'} :variant=${'primary'} />
                </div>
                <div class="row">
                    <ui-input :placeholder=${'Filter...'} :size=${'sm'} />
                    <ui-button
                        :label=${'Go'}
                        :variant=${'primary'}
                        :size=${'sm'}
                    />
                </div>
            </div>
            <div class="section">
                <h2>Input group</h2>
                <div class="row" style="margin-bottom: 1rem">
                    <ui-input-group>
                        <ui-input :placeholder=${'Search jobs...'} />
                        <ui-button :label=${'Search'} :variant=${'primary'} />
                    </ui-input-group>
                </div>
                <div class="row" style="margin-bottom: 1rem">
                    <ui-input-group>
                        <ui-button :label=${'Go'} :variant=${'secondary'} />
                        <ui-input :placeholder=${'Filter...'} />
                        <ui-button :label=${'Clear'} :variant=${'secondary'} />
                    </ui-input-group>
                </div>
                <div class="row">
                    <ui-input-group>
                        <ui-input :placeholder=${'City'} />
                        <ui-input :placeholder=${'State'} />
                        <ui-input :placeholder=${'Zip'} />
                    </ui-input-group>
                </div>
            </div>
            <div class="section">
                <h2>Card</h2>
                <div class="row">
                    <ui-card>
                        <span slot="header">Card header</span> Card content
                        lives in a slot. <span slot="footer">Card footer</span>
                    </ui-card>
                </div>
            </div>
            <div class="section">
                <h2>Table</h2>
                <ui-table>
                    <ui-table-head>
                        <ui-table-row>
                            <ui-table-head-cell>Job</ui-table-head-cell>
                            <ui-table-head-cell>Status</ui-table-head-cell>
                            <ui-table-head-cell>Worker</ui-table-head-cell>
                            <ui-table-head-cell>Duration</ui-table-head-cell>
                        </ui-table-row>
                    </ui-table-head>
                    <ui-table-body>
                        <ui-table-row>
                            <ui-table-cell>send-email</ui-table-cell>
                            <ui-table-cell>
                                <ui-badge :label=${'completed'} :tone=${'ok'} />
                            </ui-table-cell>
                            <ui-table-cell>worker-1</ui-table-cell>
                            <ui-table-cell>1.2s</ui-table-cell>
                        </ui-table-row>
                        <ui-table-row>
                            <ui-table-cell>build-report</ui-table-cell>
                            <ui-table-cell>
                                <ui-badge
                                    :label=${'running'}
                                    :tone=${'info'}
                                    :pulse=${true}
                                />
                            </ui-table-cell>
                            <ui-table-cell>worker-2</ui-table-cell>
                            <ui-table-cell>-</ui-table-cell>
                        </ui-table-row>
                        <ui-table-row>
                            <ui-table-cell>sync-data</ui-table-cell>
                            <ui-table-cell>
                                <ui-badge :label=${'failed'} :tone=${'err'} />
                            </ui-table-cell>
                            <ui-table-cell>worker-1</ui-table-cell>
                            <ui-table-cell>0.4s</ui-table-cell>
                        </ui-table-row>
                    </ui-table-body>
                </ui-table>
            </div>
            <div class="section">
                <h2>Scrollable</h2>
                <ui-card>
                    <ui-scrollable :height=${'8rem'}>
                        <p>Log line 1 - worker booted</p>
                        <p>Log line 2 - claimed job send-email</p>
                        <p>Log line 3 - job completed in 1.2s</p>
                        <p>Log line 4 - claimed job build-report</p>
                        <p>Log line 5 - still running</p>
                        <p>Log line 6 - retry scheduled</p>
                        <p>Log line 7 - claimed job sync-data</p>
                        <p>Log line 8 - job failed</p>
                        <p>Log line 9 - reconciling</p>
                        <p>Log line 10 - idle</p>
                    </ui-scrollable>
                </ui-card>
            </div>
        </dashboard-layout>
    `;
}
