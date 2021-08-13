import { Input } from "antd"

export interface TIAInputProps {
    key: string
    placeholder: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}
export const TabItemArticalInput = (props: TIAInputProps) => {

    return <div className="tab-input" key={props.key}>
        <Input
            placeholder={props.placeholder}
            // value={input}
            onChange={props.onChange}
        />
    </div>
}