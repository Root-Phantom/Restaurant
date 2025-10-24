import * as Select from '@radix-ui/react-select';
import { ChevronDown, ChevronUp } from 'lucide-react';
import React from 'react';
import clsx from 'clsx';

export function DarkSelect({ value, onValueChange, placeholder = 'Select...', children, className }) {
    return (
        <Select.Root value={value} onValueChange={onValueChange}>
            <Select.Trigger
                className={clsx(
                    "bg-white/5 border border-white/10 rounded-md h-10 px-3 w-full text-left inline-flex items-center justify-between",
                    className
                )}
            >
                <Select.Value placeholder={placeholder} />
                <Select.Icon><ChevronDown size={16} /></Select.Icon>
            </Select.Trigger>
            <Select.Portal>
                <Select.Content className="z-50 overflow-hidden rounded-md border border-white/10 bg-[var(--panel)] text-white shadow-lg">
                    <Select.ScrollUpButton className="flex items-center justify-center py-1 text-[var(--muted)]">
                        <ChevronUp size={16} />
                    </Select.ScrollUpButton>
                    <Select.Viewport className="p-1">
                        {children}
                    </Select.Viewport>
                    <Select.ScrollDownButton className="flex items-center justify-center py-1 text-[var(--muted)]">
                        <ChevronDown size={16} />
                    </Select.ScrollDownButton>
                </Select.Content>
            </Select.Portal>
        </Select.Root>
    );
}

export function DarkOption({ value, children }) {
    return (
        <Select.Item
            value={value}
            className="text-sm leading-9 px-2 rounded cursor-pointer focus:outline-none focus:bg-white/10 data-[state=checked]:bg-white/10"
        >
            <Select.ItemText>{children}</Select.ItemText>
        </Select.Item>
    );
}