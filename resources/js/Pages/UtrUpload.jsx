import React from 'react'
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, useForm } from '@inertiajs/react';
function UtrUpload() {
    const { data, setData, post, processing, errors } = useForm({
        utr_file: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('utr.store'), {
            data: { utr_file: data.utr_file },
            onFinish: () => setData('utr_file', null),
        });
    };

    return (
        <>
            <Head title="Upload UTR" />
            <div className="container mx-auto">
                <h1 className="text-xl font-bold">Upload UTR</h1>

                <form onSubmit={submit} className="shade p-6 rounded-lg shadow-md max-w-md mx-auto">
                    <div>
                        <input
                            type="file"
                            accept=".jpg,.png,.pdf"
                            onChange={(e) => setData('utr_file', e.target.files[0])}
                            required
                        />
                        <InputError message={errors.utr_file} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <PrimaryButton className="bg-[#fb923c] hover:bg-[#f97316] text-white" disabled={processing}>
                            Upload UTR
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </>
    );
}

export default UtrUpload
